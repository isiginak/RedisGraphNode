const {query}=global.dbClient;
async function pqDb(script,params=[]){
    let obj=null;
    global.dbClient.query(script, [], (error, results) => {
        if (error) {
          throw error
        }
        obj= results;
      })
    Promise.all([obj]).then(value=>{
        return value;
    })
}
module.exports={
    pqDb
}