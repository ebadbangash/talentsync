const Salary=require('../models/salaries');

const getAllSalaries=async (req,res)=>{
    try {
        const { job_title: jobTitle } = req.query;
        const query = {};

        if (jobTitle) {
            query.JobTitle = jobTitle;
        }

        const salaries = await Salary.find(query);
        res.json(salaries);
    } catch (error) {
        res.status(500).send("Error fetching salaries");   
    }
};
module.exports={getAllSalaries};