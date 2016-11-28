
// replace cozysdk with a standalone version
window.cozysdk.queryView = (type) => {
    return new Promise((resolve, reject) => {
        if (type === "doctypes") {
            resolve([{"key":"Access","value":17},{"key":"album","value":3},{"key":"application","value":16},{"key":"bank","value":46},{"key":"bill","value":34},{"key":"Binary","value":5678},{"key":"Bookmark","value":1},{"key":"commit","value":141},{"key":"contact","value":396},{"key":"CozyInstance","value":1},{"key":"Device","value":1},{"key":"event","value":2},{"key":"FavoriteTag","value":2},{"key":"Feed","value":3},{"key":"file","value":144},{"key":"File","value":1874},{"key":"folder","value":12},{"key":"Folder","value":1},{"key":"haste","value":1},{"key":"hastesettings","value":1},{"key":"indexdefinition","value":3},{"key":"konnector","value":48},{"key":"kresusconfig","value":4},{"key":"Mood","value":1},{"key":"Note","value":4},{"key":"phonebill","value":9},{"key":"photo","value":14},{"key":"StackApplication","value":4},{"key":"tag","value":7},{"key":"Task","value":1},{"key":"tasky","value":16},{"key":"Tasky","value":15},{"key":"TodoList","value":1},{"key":"toread","value":191},{"key":"Tree","value":1},{"key":"twittertweet","value":175},{"key":"User","value":1},{"key":"usetracker","value":742},{"key":"UseTracker","value":898},{"key":"WebDAVAccount","value":1},{"key":"ZFParam","value":4}]);
        } else if (type === "contact") {
            resolve(












                    );
        }
    });
};


import "../src/initialize";


