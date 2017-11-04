/**
 * Created by DELL on 19/10/2017.
 */

var express = require('express')
var app = express()

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM students ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('user/list', {
                    title: 'User List',
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('user/list', {
                    title: 'User List',
                    data: rows
                })
            }
        })
    })
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){
    // render to views/user/add.ejs
    res.render('user/add', {
        title: 'Add New User',
        first_name: '',
        last_name: '',
        email: '',
        matric_no: '',
        department: '',
        course: ''
    })
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){
    req.assert('firstname', 'FirstName is required').notEmpty()
    req.assert('lastname', 'Lastname is required').notEmpty()
    req.assert('email', 'A valid email is required').isEmail()
    req.assert('matric', 'Matric number is required').notEmpty()
    req.assert('dept', 'Department is required').notEmpty()
    req.assert('course', 'Course is required').notEmpty()

    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!

        var user = {
            first_name: req.sanitize('firstname').escape().trim(),
            last_name: req.sanitize('lastname').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            matric_no: req.body.matric,
            department: req.sanitize('dept').escape().trim(),
            course: req.sanitize('course').escape().trim(),
            age: req.sanitize('age').escape().trim(),
            dob: req.body.dob, //DOB does need to be trimmed
            level: req.sanitize('level').escape().trim(),
            sex: req.sanitize('sex').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            state_of_origin: req.sanitize('state').escape().trim()
        }

        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO students SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New User',
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        matric: user.matric,
                        department: user.dept,
                        course: user.course,
                        level: user.level,
                        sex: user.sex,
                        age: user.age,
                        dob: user.dob,
                        state: user.state,
                        phone: user.phone
                    })
                } else {
                    req.flash('success', 'Data added successfully!')

                    // render to views/user/add.ejs
                    res.render('user/add', {
                        title: 'Add New User',
                        firstname: '',
                        lastname: '',
                        email: '',
                        matric: '',
                        dept: '',
                        course: '',
                        age: '',
                        dob: '',
                        state: '',
                        sex: '',
                        phone: '',
                        level: ''
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name
         * because req.param('name') is deprecated
         */
        res.render('user/add', {
            title: 'Add New User',
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            matri: req.body.matric,
            dept: req.body.dept,
            course: req.body.course
        })
    }
})

// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM students WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err

            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Student with this id = ' + req.params.id +' not found!')
                res.redirect('/users')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('user/edit', {
                    title: 'Edit User',
                    //data: rows[0],
                    id: rows[0].id,
                    firstname: rows[0].first_name,
                    lastname: rows[0].last_name,
                    email: rows[0].email,
                    matric_no: rows[0].matric_no,
                    department: rows[0].department,
                    course: rows[0].course,
                    age: rows[0].age,
                    level: rows[0].level,
                    state: rows[0].state_of_origin,
                    sex: rows[0].sex,
                    dob: rows[0].dob,
                    phone: rows[0].phone
                })
            }
        })
    })
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('firstname', 'FirstName is required').notEmpty()
    req.assert('lastname', 'Lastname is required').notEmpty()
    req.assert('email', 'A valid email is required').isEmail()
    req.assert('matric', 'Matric number is required').notEmpty()
    req.assert('dept', 'Department is required').notEmpty()
    req.assert('course', 'Course is required').notEmpty()
    var errors = req.validationErrors()

    if( !errors ) {   //No errors were found.  Passed Validation!

        /********************************************
         * Express-validator module

         req.body.comment = 'a <span>comment</span>';
         req.body.username = '   a user    ';

         req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
         req.sanitize('username').trim(); // returns 'a user'
         ********************************************/
        var user = {
            first_name: req.sanitize('firstname').escape().trim(),
            last_name: req.sanitize('lastname').escape().trim(),
            email: req.sanitize('email').escape().trim(),
            matric_no: req.body.matric,
            department: req.sanitize('dept').escape().trim(),
            course: req.sanitize('course').escape().trim(),
            age: req.sanitize('age').escape().trim(),
            dob: req.body.dob, //No need to sanitize/trim this
            level: req.sanitize('level').escape().trim(),
            sex: req.sanitize('sex').escape().trim(),
            phone: req.sanitize('phone').escape().trim(),
            state_of_origin: req.sanitize('state').escape().trim()
        }


        req.getConnection(function(error, conn) {
            conn.query('UPDATE students SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)

                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        matric_no: req.body.matric,
                        department: req.body.dept,
                        course: req.body.course,
                        level: req.body.level,
                        sex: req.body.sex,
                        age: req.body.age,
                        dob: req.body.dob,
                        state: req.body.state,
                        phone: req.body.phone
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')

                    // render to views/user/add.ejs
                    res.render('user/edit', {
                        title: 'Edit User',
                        id: req.params.id,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        matric_no: req.body.matric,
                        department: req.body.dept,
                        course: req.body.course,
                        level: req.body.level,
                        sex: req.body.sex,
                        age: req.body.age,
                        dob: req.body.dob,
                        state: req.body.state,
                        phone: req.body.phone
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name
         * because req.param('name') is deprecated
         */
        res.render('user/edit', {
            title: 'Edit User',
            id: req.params.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            matric_no: req.body.matric,
            department: req.body.dept,
            course: req.body.course,
            level: req.body.level,
            sex: req.body.sex,
            age: req.body.age,
            dob: req.body.dob,
            state: req.body.state,
            phone: req.body.phone
        })
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }

    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM students WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/users')
            } else {
                req.flash('success', 'User with id = ' + req.params.id +' has been successfully deleted!')
                // redirect to users list page
                res.redirect('/users')
            }
        })
    })
})

module.exports = app
