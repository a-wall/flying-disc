// Initialize Firebase
var config = {
    apiKey: "AIzaSyCKN75AOAjLrJ-wX83b5X9qlh4jqGcS3ck",
    authDomain: "flying-disc-82658.firebaseapp.com",
    databaseURL: "https://flying-disc-82658.firebaseio.com",
    storageBucket: "flying-disc-82658.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

function recordScore(score){
    var ref = database.ref('scores').push(score); 
}

function registerForNLowestScores(n, callbackAdded, callbackRemoved){
    var dataset = database.ref('scores').orderByChild('score').limitToFirst(n);

    dataset.on('child_added', function(data, prevChildKey) {
        var score = data.val();
        callbackAdded(score, data.key, prevChildKey);
    });  

    dataset.on('child_removed', function(data) {
        var score = data.val();
        callbackRemoved(score, data.key);
    }); 
}

registerForNLowestScores(2, 
    function(score, key, previousKey) { 
        console.log(score); 
        console.log('added: ' + key);
        console.log('prev: ' + previousKey);
    },
    function(score, key) { 
        console.log(score); 
        console.log('removed: ' + key);
    }
);