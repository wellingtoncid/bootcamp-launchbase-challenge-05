const fs = require('fs')
const data = require("../data.json")
const {date, education} = require('../utils')
const Intl = require('intl')

exports.index = function (req, res) {
    return res.render('students/index', { students:data.students })
}

exports.create = function (req, res) {
    return res.render('students/create')
}

exports.show = function (req,res) {
    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudent) return res.send('Student not found')

    const student = {
        ...foundStudent,
        dob: date(foundStudent.dob).birthDay
    }

    return res.render('students/show', { student })

}

exports.post = function (req, res) {

    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == '')
            return res.send('Please complete all fields.')
    }

    dob = Date.parse(req.body.dob)
    
    let id = 1
    const lastStudent = data.students[data.students.length - 1]

    if (lastStudent) {
        id = lastStudent.id + 1
    }
    
    data.students.push({
        id, 
        ...req.body,
        dob
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if (err) return res.send("Write file error")
        return res.redirect(`/students/${id}`)
    })
}

exports.edit = function (req, res) {
    const { id } = req.params

    const foundStudent = data.students.find(function (student) {
        return student.id == id
    })

    if (!foundStudent) return res.send('Student not found')

    const student = {
        ...foundStudent,
        dob: date(foundStudent.dob).iso
    }

    return res.render('students/edit', { student })
}

exports.put = function(req,res) {
    const { id } = req.body
    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex) {
        if (id == student.id) {
            index = foundIndex
            return true
        }
    })

    if (!foundStudent) return res.send('Student not found')

    const student = {
        ...foundStudent,
        ...req.body,
        dob: Date.parse(req.body.dob),
        id: Number(foundStudent.id)
    }

    data.students[index] = student

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write file error")

        return res.redirect(`/students/${id}`)
    })

}

exports.delete = function(req,res) {
    const { id } = req.body

    const filteredStudents = data.students.filter(function(student) {
        return student.id != id
    })

    data.students = filteredStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write file error")

        return res.redirect('/students')
    })

}