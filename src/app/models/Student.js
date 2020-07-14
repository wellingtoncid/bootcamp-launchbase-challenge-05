const { age, date, education, } = require('../../lib/utils')
const db = require('../../config/db')


module.exports = {
    all(callback) {

        db.query(`SELECT * FROM students`, function (err, results) {
            if(err) throw `Database error! ${err}`
            callback(results.rows)
        })

    },
    create(data, callback) {

        const query = `
            INSERT INTO students (
                avatar_url,
                name,
                email,
                birth_date,
                education_level,
                course_hours,
                teacher_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth_date).iso,
            data.education_level,
            data.course_hours,
            data.teacher
        ]

        db.query(query, values, function (err, results) {
            if(err) throw `Database error! ${err}`

            callback(results.rows[0])
        })
    },
    find(id, callback) {
        db.query(`
        SELECT students.*, teachers.name AS teacher_name
        FROM students
        LEFT JOIN teachers ON (students.teacher_id = teachers.id)
        WHERE students.id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`
            callback(results.rows[0])
        })
    },
    update(data, callback) {
        const query = `
        UPDATE students SET
            avatar_url=($1),
            name=($2),
            email=($3),
            birth_date=($4),
            education_level=($5),
            course_hours=($6),
            teacher_id=($7)
        WHERE id = $8
        `

        const values = [
            data.avatar_url,
            data.name,
            data.email,
            date(data.birth_date).iso,
            data.education_level,
            data.course_hours,
            data.teacher,
            data.id
        ]

        db.query(query, values, function(err, results){
            if(err) throw `Database error! ${err}`
            callback()
        })
    },
    delete(id, callback) {
        db.query(`DELETE FROM students WHERE id = $1`, [id], function(err, results){
            if(err) throw `Database error! ${err}`

            return callback()
        })
    },
    teachersSelectOptions(callback) {
        db.query(`SELECT name, id FROM teachers`, function(err, results) {
            if(err) throw 'Database error!'

            callback(results.rows)
        })
    }
}