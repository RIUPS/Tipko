module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tipko API',
      version: '1.0.0',
      description: 'API za lekcije, napredek in dosežke'
    },
    servers: [ { url: 'http://localhost:5000/api' } ],
    tags: [
      { name: 'Lessons', description: 'Operations for lessons and lesson management' },
      { name: 'Progress', description: 'User progress, achievements and leaderboard' },
      { name: 'Admin', description: 'Administrative endpoints (manage lessons, users, backups)' },
      { name: 'Auth', description: 'Authentication endpoints' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        Lesson: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            category: { type: 'string', enum: ['miška','tipkovnica','bližnjice','splet','mini-igre'] },
            difficulty: { type: 'string', enum: ['začetnik','srednji','napredni'] },
            description: { type: 'string' },
            instructions: { type: 'array', items: { type: 'string' } },
            content: { type: 'object' },
            points: { type: 'number' },
            order: { type: 'number' },
            isActive: { type: 'boolean' },
            icon: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        LessonCreate: {
          type: 'object',
          required: ['title','description','content','order','category'],
          properties: {
            title: { type: 'string' },
            category: { type: 'string' },
            difficulty: { type: 'string' },
            description: { type: 'string' },
            instructions: { type: 'array', items: { type: 'string' } },
            content: { type: 'object' },
            points: { type: 'number' },
            order: { type: 'number' },
            isActive: { type: 'boolean' },
            icon: { type: 'string' }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        },
        CompletedLesson: {
          type: 'object',
          properties: {
            lessonId: { $ref: '#/components/schemas/Lesson' },
            completedAt: { type: 'string', format: 'date-time' },
            score: { type: 'number' },
            attempts: { type: 'number' },
            timeSpent: { type: 'number' },
            isPerfect: { type: 'boolean' }
          }
        },
        Achievement: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            condition: { 
              type: 'object',
              properties: {
                type: { type: 'string' },
                value: { type: 'number' },
                category: { type: 'string' }
              }
            },
            rarity: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        UserProgress: {
          type: 'object',
          properties: {
            user: { type: 'string' },
            nickname: { type: 'string' },
            completedLessons: { type: 'array', items: { $ref: '#/components/schemas/CompletedLesson' } },
            totalPoints: { type: 'number' },
            achievements: { 
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  achievement: { $ref: '#/components/schemas/Achievement' },
                  earnedAt: { type: 'string', format: 'date-time' },
                  shown: { type: 'boolean' }
                }
              }
            },
            categoryStats: { type: 'object' },
            totalAttempts: { type: 'number' },
            currentStreak: { type: 'number' },
            longestStreak: { type: 'number' },
            lastActive: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        LeaderboardEntry: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            nickname: { type: 'string' },
            totalPoints: { type: 'number' },
            currentStreak: { type: 'number' },
            completedLessons: {
                type: 'array',
                items: { $ref: '#/components/schemas/CompletedLesson' }
            },
            achievements: { type: 'array', items: { $ref: '#/components/schemas/Achievement' } },
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' }
          }
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string' }
          }
        },
        AdminAction: {
          type: 'object',
          properties: {
            action: { type: 'string' },
            payload: { type: 'object' }
          }
        }
      }
    }
  },
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};
