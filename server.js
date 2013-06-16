var express   = require('express'),
    everyauth = require('everyauth'),
    util      = require('util'),
    graph     = require('fbgraph');

everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });

everyauth.facebook
    .appId('305888412839822')
    .appSecret('a028c7b42a703b29ff883688c92a9564')
    .scope('user_groups')
    .handleAuthCallbackError(function(req,res){
        console.log("Error");
    })
    .findOrCreateUser(function(session,accessToken,accesTokExtra,fbUserMetadata){
        graph.setAccessToken(accessToken);
        return usersByFbId[fbUserMetadata.id] ||
        (usersByFbId[fbUserMetadata.id] = addUser('facebook',fbUserMetadata));
    }).redirectPath('/');

function addUser(source,sourceUser){
    var user;    
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
    return user;
}

var usersById = {};
var usersByFbId = {};
var nextUserId = 0;

var app = express();
app.set('views',__dirname+'/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret :'sopitaparami123'}));
app.use(everyauth.middleware());

app.get('/',function(req,res){
    res.render('home',{title: 'Sentiment Analysis'})
});

app.get('/sentiment',function(req,res){
    if(req.session.auth && req.session.auth.loggedIn){
        /* 
        MyEF facebook id = 131084400257458
        feed contains posts in a facebook group (is a connection in graph).
        limit is a modifier of feed for limit the get request to n posts.
        message, comments, type and likes are fields of posts in feed.
        like_count and message are fields of comments in posts.
        */
        var posts;
        graph.get('131084400257458?fields=feed.limit(100).fields(message, likes, type, comments.fields(like_count,message))',
        function(err, response){
            res.render('private',{corpus: JSON.stringify(response)})
        }); 
    }
    else{
        console.log("The user is not logged in");
        res.render('home',{title: 'Sentiment Analysis', alert: 'User is not logged in'});
    }
});
app.listen(3000);
console.log("Express server listen in port 3000");
