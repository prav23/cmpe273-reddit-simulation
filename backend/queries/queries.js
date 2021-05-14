const con = require('../utils/mysqlConnection.js');

var queries = {};


queries.createUserTable = (successcb, failurecb) => {
    let sql = "CREATE TABLE users (email VARCHAR(255), name VARCHAR(255), password VARCHAR(255), userid int AUTO_INCREMENT NOT NULL PRIMARY_KEY(userid))";
   // const values = [user.email, user.password, user.name]
    con.query(sql, function (err, result){
        if (err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}

queries.createuser = (user, successcb, failurecb) => {
    let sql = "INSERT INTO users (email, password, name ) VALUES ?";
    const values = [user.email, user.password, user.name]
    con.query(sql, [[values]], function (err, result){
        if (err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}

queries.getuserPasswordByEmail = (email, successcb, failurecb) => {
    let sql = 'SELECT password,name FROM users WHERE email = ?';
    con.query(sql, [email], function (err, row){
        if (err){
            failurecb(err);
            return;
        }
        successcb(row[0]);
    });
}

queries.getAllUsers = (successcb, failurecb) => {
    let sql = 'SELECT * FROM users';
    con.query(sql, function (err, row){
        if (err){
            failurecb(err);
            return;
        }
        successcb(row[0]);
    });
}

queries.getuserPasswordById = (userid, successcb, failurecb) => {
    let sql = 'SELECT password FROM users WHERE userid = ?';

    con.query(sql, [useridid], function (err, row){
        if (err){
            failurecb(err);
            return;
        }
        successcb(row[0]);
    });
}

queries.getuserNameById = (userid, successcb, failurecb) => {
    let sql = 'SELECT name FROM users WHERE userid = ?';

    con.query(sql, [userid], function (err, row){
        if (err){
            failurecb(err);
            return;
        }
        successcb(row[0]);
    });
}


queries.getuserImageNameById = (id, successcb, failurecb) => {
    let sql = 'SELECT image FROM users WHERE id = ?';

    con.query(sql, [id], function (err, row){
        if (err){
            failurecb(err);
            return;
        }
        successcb(row[0]);
    });
}

queries.getuserDetailsById = (id, successcb, failurecb) => {
    let sql = `SELECT name, phone, street, unit_no, city, state, zip_code
    FROM profile WHERE id = ?`;

    con.query(sql, [id], function (err, row){
        if (err){
            failurecb(err);
            return;
        }
        successcb(row[0]);
    });
}

queries.updateuserName = (user, successcb, failurecb) => {
    let sql = `UPDATE users SET name =  ? WHERE id = ?`;
    let values = [user.name, user.id];
    
    con.query(sql, values, function (err, result){
        if (err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}

queries.updateuserEmail = (user, successcb, failurecb) => {
    let sql = `UPDATE users SET email = ? WHERE id = ?`;
    let values = [user.email, user.id];
    
    con.query(sql, values, function (err, result){
        if (err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}

queries.updateuserPassword = (user, successcb, failurecb) => {
    let sql = `UPDATE users SET password = ? WHERE id = ?`;
    let values = [user.password, user.id];
    
    con.query(sql, values, function (err, result){
        if (err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}

queries.updateuserAddress = (id, user, successcb, failurecb) => {
    let sql = `UPDATE users 
    SET phone = ?, street = ?, unit_no = ?, city = ?, state = ?, zip_code = ?
    WHERE id = ?`;
    let values = [user.phone, user.street, user.unit, user.city, user.state, user.zip, id];
    
    con.query(sql, values, function (err, result){
        if (err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}

queries.updateuserProfile = (id, user, successcb, failurecb) => {
    let sql = `UPDATE users 
    SET fname =?, lname =?, phone = ?, street = ?, unit_no = ?, city = ?, state = ?, zip_code = ?
    WHERE id = ?`;
    let values = [user.fname, user.lname, user.phone, 
        user.street, user.unit, user.city, user.state, user.zip, id];
    
    con.query(sql, values, function (err, result){
        if (err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}

queries.updateuserImage = (user, successcb, failurecb) => {
    let sql = `UPDATE users 
    SET image = ?
    WHERE id = ?`;
    let values = [user.image, user.id];
    con.query(sql, values, function (err, result){
        if (err){
            failurecb(err);
            return;
        }
        successcb(result);
    });
}


module.exports = queries;