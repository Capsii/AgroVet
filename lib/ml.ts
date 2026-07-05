import * as tf from '@tensorflow/tfjs';

// Cache for loaded models and their metadata (labels)
interface LoadedModel {
    model: tf.LayersModel;
    labels: string[];
}

const MODELS: Record<string, LoadedModel> = {};

// Label mappings to match our database/disease-info keys
const LABEL_MAPPING: Record<string, string> = {
    // Pig
    'Greasy pig disease': 'Greasy skin disease',
    // Sheep/Goat
    'Myasis': 'Myiasis',
    'Ectoparasites': 'Ectoparasites',
    'Dermatophytosis (Ringworm)': 'Dermatophytosis (Ringworm)', // Using specific key for Goat
    'Mange': 'Mange',
    // Cow
    'mastities': 'Mastitis',
    'lumpy': 'Lumpy Skin Disease',
    'foot rot': 'Foot Rot',
    'pink eye': 'Pink eye',
    // Buffalo
    'bloat': 'Bloat',
    'Malignant Catarrhal': 'Malignant Catarrhal Fever',
    'ringworm': 'Ringworm',
    // Horse
    'Equine Recurrent Uveitis (Moon Blindness)': 'Equine Recurrent Uveitis',
    'Rain Rot (Dermatophilosis)': 'Rain Rot',
    // Hen
    'Newcastle Disease (Ranikhet)': 'Newcastle Disease',
    'Mite Lice Infestation': 'Mite/Lice Infestation',
    'Feather Loss  Pecking Injury': 'Feather Loss / Pecking', // Note double space in original label
    // General
    'Badquality': 'Bad Quality',
    'Bad quality': 'Bad Quality',
    'healthy': 'Healthy'
};

/**
 * Loads a model and its metadata from the public directory.
 */
export async function loadModel(modelName: string): Promise<LoadedModel> {
    if (MODELS[modelName]) {
        return MODELS[modelName];
    }

    try {
        const basePath = `/model/${modelName}`;

        // Load metadata to get labels
        const metadataResponse = await fetch(`${basePath}/metadata.json`);
        if (!metadataResponse.ok) {
            throw new Error(`Failed to load metadata for ${modelName}`);
        }
        const metadata = await metadataResponse.json();
        const labels = metadata.labels || [];

        // Load the model (Teachable Machine models are LayersModels)
        const model = await tf.loadLayersModel(`${basePath}/model.json`);

        // Warmup the model
        const dummyInput = tf.zeros([1, 224, 224, 3]);
        model.predict(dummyInput);
        dummyInput.dispose();

        const loadedModel = { model, labels };
        MODELS[modelName] = loadedModel;

        console.log(`Model ${modelName} loaded with labels:`, labels);
        return loadedModel;
    } catch (error) {
        console.error(`Error loading model ${modelName}:`, error);
        throw error;
    }
}

/**
 * Preprocesses an image element for Teachable Machine models.
 * Expected input: 224x224 RGB image.
 * Normalization: (pixel / 127.5) - 1  -> range [-1, 1]
 */
function preprocessImage(image: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): tf.Tensor {
    return tf.tidy(() => {
        let tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([224, 224]) // Ensure 224x224
            .toFloat();

        // Normalize to [-1, 1] which is standard for Teachable Machine (MobileNet based)
        const offset = tf.scalar(127.5);
        const normalized = tensor.sub(offset).div(offset);

        // Expand dims to create a batch of 1: [1, 224, 224, 3]
        return normalized.expandDims(0);
    });
}

export async function analyzeImage(
    imageElement: HTMLImageElement,
    animalType: 'pig' | 'sheep' | 'cow' | 'buffalo' | 'goat' | 'horse' | 'hen' | 'dog' | 'donkey' | 'yak' | 'camel' | 'pony' | 'cat' | 'bull-bison'
): Promise<{
    disease: string;
    confidence: number;
    severity: 'Low' | 'Medium' | 'High'; // Mocked for now based on disease
}> {
    try {
        const { model, labels } = await loadModel(animalType);

        const tensor = preprocessImage(imageElement);
        const predictions = model.predict(tensor) as tf.Tensor;
        const data = await predictions.data(); // Float32Array of probabilities

        // Find index of highest probability
        let maxProb = -1;
        let maxIndex = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i] > maxProb) {
                maxProb = data[i];
                maxIndex = i;
            }
        }

        // Cleanup
        tensor.dispose();
        predictions.dispose();

        const rawLabel = labels[maxIndex] || 'Unknown';
        const disease = LABEL_MAPPING[rawLabel] || rawLabel;

        console.log(`Prediction: ${disease} (${(maxProb * 100).toFixed(2)}%)`);

        // Determine severity based on disease type (simple heuristic)
        let severity: 'Low' | 'Medium' | 'High' = 'Medium';
        if (disease.includes('Healthy')) severity = 'Low';
        if (disease === 'Bad Quality') severity = 'Low';
        if (disease === 'Mange' || disease === 'Myiasis') severity = 'High';

        return {
            disease,
            confidence: maxProb,
            severity
        };
    } catch (error) {
        console.error('Analysis failed:', error);
        throw error;
    }
}
