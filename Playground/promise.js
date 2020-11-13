const doWorkPromise = new Promise((resolve, reject) => {
  setTimeout(function () {
    // resolve([7,4,1])
    reject('DoWork Failed!')
  }, 2000);
})

doWorkPromise.then((result) => {
  console.log('Success!', result);
}).catch((error) => {
  console.log('Error!', error);
})
