const fs = require('fs');
const path = require('path');
global.FileExe;
global.Text;
global.count = 0;

if(process.argv.length == 4)
{
  FileExe = '.'+process.argv[2];
  Text = process.argv[3];
}
else 
{
  console.log('USAGE: node search [EXT] [TEXT]');
   process.exit(1);
}
 



/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 * 
 * @param {String} dir 
 * @param {Function} done 
 */
function filewalker(dir, done) {
    let results = [];

    fs.readdir(dir, function(err, list) {
        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function(file){
            file = path.resolve(dir, file);

            fs.stat(file, function(err, stat){
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                   // results.push(file);

                    filewalker(file, function(err, res){
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    
                    if( path.extname(file) == FileExe  ) 
                       {
                           fs.readFile(file, function (err, data) {
                              if (err) throw err;
                              if(data.indexOf(Text) >-1)
                                   {
                                      console.log(file);
                                      count = 1;
                                   }
                           });   
                            
                          
                       }                              
                    
                    

                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

filewalker(process.cwd() , function(err, data){
    if(err){
        throw err;
    }
    
              if (count == 0)
             console.log('No file was found');
});