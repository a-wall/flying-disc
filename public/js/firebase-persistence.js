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

function registerForNLowestScores(n, callback){
    var dataset = database.ref('scores').orderByChild('score').limitToFirst(n);

    dataset.on('value', function(snapshot) {
        var topScores = snapshot.val();
        callback(topScores);
    });  
}

// TODO: remove this function and use registerForNLowestScores directly
function registerForTopTen(callback){
    registerForNLowestScores(2, callback);
}
