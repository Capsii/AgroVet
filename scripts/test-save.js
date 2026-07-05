const fetch = require('node-fetch');

async function testSave() {
    const payload = {
        animal_id: 'test-animal-id',
        diagnosis_type: 'symptoms',
        symptoms: ['Fever', 'Limping'],
        image_url: null,
        disease_name: 'Test Disease',
        confidence_score: 88,
        severity: 'Medium',
        causes: ['Test Cause'],
        treatment_recommendations: ['Test Tx'],
        prevention_tips: ['Test Prevention'],
        status: 'diagnosed'
    };

    try {
        const res = await fetch('http://localhost:3000/api/diagnoses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-user-id'
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const err = await res.json();
            console.error('Failed:', res.status, err);
        } else {
            console.log('Success:', await res.json());
        }
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testSave();
