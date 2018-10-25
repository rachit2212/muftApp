module.exports = {
	ADMIN: {
		USER_NAME: 'MUFT_ADMIN'
		, PASSWORD: 'MUFT_ADMIN@123'
	}
	, ROLES: {
		CUSTOMER: 'customer'
		, ADMIN: 'admin'
	}
	, QUIZ_CATEGORY: {
		DAILY_QUIZ: {
			LIMIT: 8,
			POINTS: 1
		},
		FAST_QUIZ: {
			LIMIT: 2,
			POINTS: 1
		},
		// page-title
		SOCIAL_MISSION: {
			POINTS: 1
		},
		DAILY_MISSION: {
			POINTS: 1,
			LIMIT: 1
		},
		WATCH_MISSION: {
			POINTS: 1
		},
		SELFI_MISSION: {
			POINTS: 1
		}
	}
	, PROMO_CODES: {
		VALID_FOR: {
			DAILY: 'DAILY',
			ONCE: 'ONCE'
		}
	}
}