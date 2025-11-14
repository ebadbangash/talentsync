const express=require('express');
const salaryController =require('../controllers/salaryController');
const router=express.Router();
router.get('/salaries',salaryController.getAllSalaries);
module.exports=router;