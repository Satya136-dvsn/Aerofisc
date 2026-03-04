const https = require('https');
const fs = require('fs');

// Fetch the latest workflow runs
https.get('https://api.github.com/repos/Satya136-dvsn/Aerofisc/actions/runs?status=failure', {
    headers: {
        'User-Agent': 'NodeJS-Downloader'
    }
}, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });

    res.on('end', () => {
        try {
            const parsedData = JSON.parse(rawData);
            const runId = parsedData.workflow_runs[0].id;

            console.log(`Latest failed run ID: ${runId}`);

            // Now fetch the jobs for this run
            https.get(`https://api.github.com/repos/Satya136-dvsn/Aerofisc/actions/runs/${runId}/jobs`, {
                headers: { 'User-Agent': 'NodeJS-Downloader' }
            }, (jobRes) => {
                let jobData = '';
                jobRes.on('data', (c) => { jobData += c; });

                jobRes.on('end', () => {
                    const jobs = JSON.parse(jobData).jobs;
                    const logUrl = jobs.find(j => j.name.includes('Load Tests')).url + '/logs';
                    console.log(`Log URL: ${logUrl}`);
                    console.log("Note: GitHub Actions logs still require an authenticated PAT token to download.");
                });
            });

        } catch (e) {
            console.error(e.message);
        }
    });
});
