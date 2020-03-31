SELECT assignments.id,
name,
day,
chapter,
count(assistance_requests.id) AS total_assistances
FROM assignments
JOIN assistance_requests ON assignment_id = assignments.id
GROUP BY assignments.id
ORDER BY total_assistances DESC;