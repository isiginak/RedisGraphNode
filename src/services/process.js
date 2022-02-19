

async function setDataToRedisGraph(){
    global.dbClient.query('select * from public."user"; select * from role; select * from user_role;', [], async (error, results) => {
        if (error) {
          throw error
        }
       console.log(results);
       const users=results[0].rows;
       const roles= results[1].rows;
       const userRoles=results[2].rows;
       for(let i=0; i<users.length; i++){
       await global.graph.query(`CREATE (:USER{userId:${users[i].id},name:"${users[i].name}",surname:"${users[i].surname}",telephone:"${users[i].telephone}"})`)
       }
       for(let i=0; i<roles.length; i++){
        await global.graph.query(`CREATE (:ROLE{roleId:${roles[i].id},name:"${roles[i].name}",description:"${roles[i].description}",isActive:"${roles[i].is_active}"})`);
        }
        for(let i=0; i<userRoles.length; i++){
         await global.graph.query(`MATCH (u${i}:USER), (r${i}:ROLE) WHERE (u${i}.userId = ${userRoles[i].user_id} AND r${i}.roleId=${userRoles[i].role_id})  CREATE (u${i})-[:userRoles]->(r${i})`);
        }
      });
}



module.exports = {
setDataToRedisGraph
}