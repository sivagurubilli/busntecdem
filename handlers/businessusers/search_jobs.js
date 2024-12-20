

const responsesCommon = require('../../common/response.common');
const JobPosting = require('../../models').JobPosting; // Correctly import JobPosting model
const { Op } = require('sequelize');

async function searchJobs(req, res) {
    try {
        const { searchText, location } = req.body;

        console.log('Search Text:', searchText); // Log search text
        console.log('Location:', location); // Log location

        // Define base search conditions for job postings
        const searchConditions = {
            status: "1" // Assuming '1' represents active jobs (change to true if it's a boolean)
        };

        // Add conditions for searchText if provided
        if (searchText && searchText.trim() !== "") {
            searchConditions[Op.or] = [
                { title: { [Op.like]: `%${searchText}%` } },
                { skills: { [Op.like]: `%${searchText}%` } }
            ];
        }

        // Add condition for location if provided
        if (location && location.trim() !== "") {
            searchConditions.location = { [Op.like]: `%${location}%` };
        }

        console.log('Search Conditions:', searchConditions); // Log the search conditions

        // Search for job postings based on the conditions
        const searchedJobs = await JobPosting.findAll({
            where: searchConditions
        });

        console.log('Searched Jobs:', searchedJobs); // Log the results

        // Return job data directly without additional processing
        return res.status(200).send(
            responsesCommon.formatSuccessMessage('Data fetched successfully!', searchedJobs, 200)
        );
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return res.status(400).send(
            responsesCommon.formatErrorMessage(error.message, 400, null)
        );
    }
}

module.exports = {
    searchJobs
};
