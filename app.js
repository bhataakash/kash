import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Helper function to make RapidAPI requests with enhanced prompting
async function makeRapidAPIRequest(query) {
  return new Promise((resolve, reject) => {
    const enhancedQuery = `Provide a detailed, comprehensive response about: ${query}

    Include information about:
    1. Historical background and context
    2. Cultural significance and impact
    3. Traditional practices and customs
    4. Modern relevance and applications
    5. Related concepts and connections
    6. Specific examples and illustrations
    7. Expert perspectives and insights
    8. Common misconceptions
    9. Future implications
    
    Format the response with clear sections and detailed explanations.`;

    const options = {
      hostname: 'chatgpt-ai-chat-bot.p.rapidapi.com',
      path: '/ask',
      method: 'POST',
      headers: {
        'x-rapidapi-key': 'a42c9183b1msh2b4a680d05177b1p153585jsn0f3f711e1699',
        'x-rapidapi-host': 'chatgpt-ai-chat-bot.p.rapidapi.com',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          console.error('Error parsing response:', error);
          // Return a fallback response instead of rejecting
          resolve({
            response: "I apologize, but I'm having trouble processing that request. Could you please try again?"
          });
        }
      });
    });

    req.on('error', (error) => {
      console.error('Request error:', error);
      // Return a fallback response instead of rejecting
      resolve({
        response: "I apologize, but I'm having trouble connecting to the service. Please try again in a moment."
      });
    });

    req.write(JSON.stringify({ query: enhancedQuery }));
    req.end();
  });
}

// Process AI response into required format with enhanced error handling
function processAIResponse(response) {
  try {
    const responseText = response.response || response.text || 'No response received';
    
    // Enhanced response with more detailed sections and cultural context
    const structuredResponse = {
      kashmiriUrdu: `بہٕ چھُس تُہَنٛد مددگار۔ کٲشُر زبانَس منٛز دِمہٕ مُکَمَل جواب۔\n\n${responseText}\n\n` + 
                    `یِم نٕکات روزِو یاد:\n` +
                    `• کٲشُر ثقافت\n` +
                    `• تٲریخی پَس مَنظَر\n` +
                    `• مَقامی رِوایَت\n`,
      
      kashmiriEnglish: `Bah chus tuhund madadgaar. Koshur zabaanas manz dimah mukammal jawaab.\n\n${responseText}\n\n` +
                      `Yim nikaat roziv yaad:\n` +
                      `• Koshur saqafat\n` +
                      `• Taariekhi pas manzar\n` +
                      `• Maqaami riwaayat\n`,
      
      english: `Here is a detailed and comprehensive answer in authentic Kashmiri language:\n\n${responseText}\n\n` +
              `Key points to remember:\n` +
              `• Cultural significance and context\n` +
              `• Historical background and evolution\n` +
              `• Local traditions and practices\n` +
              `• Modern interpretations and relevance\n` +
              `• Related customs and beliefs\n`
    };

    return structuredResponse;
    
  } catch (error) {
    console.error('Error processing AI response:', error);
    return createDefaultResponse();
  }
}

// Create default response when needed
function createDefaultResponse(message = '') {
  return {
    kashmiriUrdu: `بہٕ چھُس تُہَنٛد مددگار۔ کٲشُر زبانَس منٛز دِمہٕ مُکَمَل جواب۔ ${message}`,
    kashmiriEnglish: `Bah chus tuhund madadgaar. Koshur zabaanas manz dimah mukammal jawaab. ${message}`,
    english: `I am your assistant. I will provide a comprehensive answer in authentic Kashmiri language. ${message}`
  };
}

// AI completion endpoint with enhanced error handling
app.post('/api/ai_completion', async (req, res) => {
  try {
    const { prompt, data } = req.body;

    if (!prompt || !data) {
      console.warn('Missing prompt or data in request');
      return res.status(200).json(createDefaultResponse('Please provide a valid question or input.'));
    }

    // Make request to RapidAPI with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    );

    const responsePromise = makeRapidAPIRequest(data);
    const aiResponse = await Promise.race([responsePromise, timeoutPromise])
      .catch(error => {
        console.error('API Error:', error);
        return {
          response: "I apologize for the delay. Please try your question again."
        };
      });
    
    // Process and format the response
    const formattedResponse = processAIResponse(aiResponse);
    
    return res.status(200).json(formattedResponse);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(200).json(createDefaultResponse('An error occurred. Please try again.'));
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong. Please try again later.'
  });
});

// Start server with error handling
const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on('error', (error) => {
  console.error('Failed to start server:', error);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;