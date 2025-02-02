require('../utils/db')
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    id_user : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    slug : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
}, {
    timestamps : true
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = {
    Blog
}