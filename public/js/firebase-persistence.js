// Initialize Firebase
var config = {
    apiKey: "AIzaSyCKN75AOAjLrJ-wX83b5X9qlh4jqGcS3ck",
    authDomain: "flying-disc-82658.firebaseapp.com",
    databaseURL: "https://flying-disc-82658.firebaseio.com",
    storageBucket: "flying-disc-82658.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

database.ref('/').on('value', function(snapshot) {
    console.log(snapshot.val());
});

function postScore(player, score) {
    var scoreData = {
        player: player,
        score: score
    };

    var newKey = database.ref().child('scores').push().key;

    var updates = {};
    updates['/scores/' + newKey] = scoreData;

    return firebase.database().ref().update(updates);
}

function recordScore(score){

}

function registerForTopTen(callback){
    var scores = [
        {
            name : "BOB",
            holes : [3,3,3,3,3,4,4,5,1],
            score : 29,
            timestamp : new Date()
        }
    ];
    callback(scores);
}