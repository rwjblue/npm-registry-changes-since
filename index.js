import fetch from 'node-fetch';

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  let since = process.argv[2];
  if (since === undefined) {
    let response = await fetch(`https://replicate.npmjs.com/_changes?since=${since}`);

    let body = await response.json();

    // first call to getUpdates returns no objects, only the new "since" value
    since = body.last_seq;

    // give some for updates
    await sleep(500);
  }

  let shouldContinue = true;
  while (shouldContinue) {
    let response = await fetch(`https://replicate.npmjs.com/_changes?since=${since}&include_docs=true&limit=50`);
    let body = await response.json();

    for (let result of body.results) {
      console.log(result.seq, result.id, result.doc.keywords);
      since = result.seq;
    }

    // if we didn't have the maximum changes (based on the `limit` we set in the query) wait some time...
    shouldContinue = body.results.length === 50;
  }
}

main();
