// Imports =========================================================
// O Express é o framework que usaremos para a criacāo da nossa API
const express = require('express')

// O Consign é um módulo que vai nos auxiliar com modularização
const consign = require('consign')

// O Body-Parser é um módulo nativo do Node que facilita o acesso
// ao 'body' das requisições
const bodyParser = require('body-parser')
// =================================================================

const server = express()

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

consign()
    .include('./config/firebaseConfig.js')
    .include('./app/routes')
    .into(server)

module.exports = server
