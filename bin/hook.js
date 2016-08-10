#!/bin/env node

var fs = require("fs"),
    walk = require("walk"),
    org = require("../lib/org.js"),
    http = require('http'),
    exec = require('child_process').exec,
    qiniu = require('qiniu'),
    path = require("path");

(function(){
    var last_time;
    try{
        last_time = fs.statSync('.last').mtime;
    }
    catch(e){
        last_time = 0;
        exec('touch .last');
    }
    qiniu.conf.ACCESS_KEY="EynbW2hbPz5qpe96JMJpGOOnHP1I265vgw146GhE";
    qiniu.conf.SECRET_KEY="fjmhDWrTPGaPGbfUt0lw5waDgAzF3S_9lGFG6-cn";
    var buket = 'albin';
    var pre_fix = 'release/';
    function uploadFile(file) {
        fs.stat(file, function(err, stat){
            if(err)
                return;
            var extra = new qiniu.io.PutExtra();
            qiniu.io.putFile(new qiniu.rs.PutPolicy(buket + ':' + pre_fix + file).token(), pre_fix+file, file, extra, function(err, ret){
                if(!err){
                    exec('touch ' + file)
                    last_time = fs.statSync(file).mtime;
                    console.log("put " + file  + " success");
                }
                else{
                    console.log(err);
                }
            });
        });
    }


    function trim(s) {
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }

    function getYear(d) {
        return d.substring(0, 4);
    }

    function getFullDate(d) {
        return d.substring(1, d.length - 1);
    }

    var OrgDB = function(){
        this.common = {
            cats:[],
            tags:[],
            orgs:[],
            years:[]
        };
        this.archives = {};
    }


    OrgDB.prototype.init = function(sources) {
        var walker = walk.walk(sources);
        var self = this;
        walker.on("file", function(root, fileStats, next){
            var filename = path.join(root, fileStats.name);
            if(path.extname(filename) == ".org"){
                //consoleole.log("[INFO] process: " + filename);
                self.genOrg(filename);
            }
            next();
        });

        walker.on("errors", function(root, erros, next){
            next();
        })

        walker.on("end", function(){
            //console.log("Done!");
            self.save();
        })
    }

    OrgDB.prototype.save = function() {

        function unique5(array){
            var r = [];
            for(var i = 0, l = array.length; i < l; i++) {
            for(var j = i + 1; j < l; j++)
              if (array[i] === array[j]) j = ++i;
            r.push(array[i]);
          }
          return r;
        }

        this.common.cats = unique5(this.common.cats);
        this.common.tags = unique5(this.common.tags);
        this.common.years = unique5(this.common.years);
        fs.writeFileSync("data/data.json", JSON.stringify(this.common));
    }

    OrgDB.prototype.genOrg = function(org_path) {
        var self = this;
        var data = fs.readFileSync(org_path);
        var doc = new org.Parser().parse(data.toString());
        doc.uri = "#/"+org_path;
        doc.path = path.dirname(org_path) + '/';
        var date = getFullDate(doc.directiveValues["date:"]);
        var year = getYear(date);
        var tags = doc.directiveValues["tags:"];
        var cat = org_path.split(path.sep)[1];
        doc = doc.convert(org.ConverterHTML, {});

        tags.split(',').forEach(function(tag){
            tag = trim(tag);
            self.common.tags.push(tag);
        });

        self.common.cats.push(cat);
        self.common.years.push(year);
        self.common.orgs.push({
            title:doc.title,
            cat:cat,
            tags:tags,
            imgs:doc.imgs,
            date:date,
            toc: doc.tocHTML,
            url: "#/"+org_path
        });

    }

    var server = http.createServer(function (request, response) {
        if (request) {
            //var commits = request.body.head_commit;
            //console.log(commits);

            var last_time = fs.statSync('.last').mtime;
            exec('cd orgs && git pull origin master');
            var tmp = new OrgDB();
            tmp.init('orgs/');

            var walker = walk.walk('orgs/');
            var self = this;
            walker.on("file", function(root, fileStats, next){
                var filename = path.join(root, fileStats.name);
                if(path.extname(filename).indexOf('.git')<0){
                    uploadFile(filename);
                }
                next();
            });

            walker.on("errors", function(root, erros, next){
                console.log(erros);
                next();
            })
            walker.on("end", function(){
                console.log("Done!");
            })
            exec('touch .last');
        }
        response.end('done');
    }).listen(8080);
})();
