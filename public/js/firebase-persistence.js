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
    var ref = database.ref('scores').push(); 
    ref.set(score);
    recordTopTen(score);
}

var topten = null;
var toptenReceived = false;
database.ref('topten').once('value').then(function(snapshot){
    topten = snapshot.val();
    toptenReceived = true;
});

function recordTopTen(score){
    if (!toptenReceived) return;
    if (topten == null) topten = [];
    topten.push(score);
    topten.sort(function(a, b){return a.score-b.score});
    topten = topten.slice(0,10);
    if (topten.includes(score))
    {
        var ref = database.ref('topten'); 
        ref.set(topten);
    }
}

function registerForTopTen(callback){
    database.ref('topten').on('value', function(snapshot) {
        var topten = snapshot.val();
        if (topten != null) topten.sort(function(a, b){return a.score-b.score});
        callback(topten);
    });  
}

