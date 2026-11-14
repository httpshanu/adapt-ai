# CodeAdapt AI — REST API Specification (v1.0)

**Document Status:** Complete API Contract  
**Base URL:** `https://api.codeadapt.ai/api/v1`  
**Protocol:** HTTPS / JSON / RESTful  
**Authentication:** Bearer JWT in `Authorization` header  

---

## 1. Global Request & Response Standards

### 1.1 Success Response Envelope
```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_01h8x9p3...",
    "timestamp": "2026-10-13T10:30:00Z"
  }
}
```

### 1.2 Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input provided.",
    "details": [
      {
        "field": "code_content",
        "message": "Code content cannot exceed 64KB."
      }
    ]
  },
  "meta": {
    "requestId": "req_01h8x9p3...",
    "timestamp": "2026-10-13T10:30:00Z"
  }
}
```

---

## 2. Authentication & Identity Endpoints

### 2.1 Sign Up
- **Method & Path:** `POST /auth/signup`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "riya.student@example.com",
    "password": "SecurePassword123!",
    "displayName": "Riya Sharma"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "c1f24d1a-64ab-4299-8ab3-380ffeaec022",
        "email": "riya.student@example.com",
        "displayName": "Riya Sharma",
        "onboardingCompleted": false,
        "diagnosticCompleted": false
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

### 2.2 Log In
- **Method & Path:** `POST /auth/login`
- **Auth:** Public
- **Request Body:**
  ```json
  {
    "email": "riya.student@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "c1f24d1a-64ab-4299-8ab3-380ffeaec022",
        "email": "riya.student@example.com",
        "displayName": "Riya Sharma"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

## 3. Diagnostic Assessment Endpoints

### 3.1 Start Diagnostic
- **Method & Path:** `POST /diagnostic/start`
- **Auth:** Required (`Bearer <JWT>`)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "assessmentId": "d8b3c19e-990a-4298-b80c-7b4d1b7e6f11",
      "status": "IN_PROGRESS",
      "totalQuestions": 12,
      "estimatedMinutes": 15,
      "questions": [
        {
          "questionId": "q_01",
          "topic": "Arrays",
          "orderIndex": 1,
          "questionText": "What is the worst-case time complexity of searching in an unsorted array of n elements?",
          "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"]
        }
      ]
    }
  }
  ```

### 3.2 Submit Diagnostic
- **Method & Path:** `POST /diagnostic/submit`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "assessmentId": "d8b3c19e-990a-4298-b80c-7b4d1b7e6f11",
    "answers": [
      {
        "questionId": "q_01",
        "selectedOptionIndex": 2,
        "timeSpentSeconds": 14
      }
    ]
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "assessmentId": "d8b3c19e-990a-4298-b80c-7b4d1b7e6f11",
      "completedAt": "2026-10-13T10:35:10Z",
      "topicBaselines": [
        {
          "topicSlug": "arrays",
          "topicName": "Arrays",
          "score": 78.0,
          "category": "Confident",
          "isProvisional": false
        },
        {
          "topicSlug": "searching",
          "topicName": "Searching",
          "score": 31.0,
          "category": "Needs Foundation",
          "isProvisional": false
        },
        {
          "topicSlug": "hashing",
          "topicName": "Hashing",
          "score": 45.0,
          "category": "Developing",
          "isProvisional": true
        }
      ],
      "firstRecommendedProblemId": "p_two_sum"
    }
  }
  ```

---

## 4. Problem Bank & Catalog Endpoints

### 4.1 Browse Problems
- **Method & Path:** `GET /problems`
- **Query Params:** `topic` (string), `difficulty` (EASY|MEDIUM|HARD), `status` (UNSEEN|SOLVED|ATTEMPTED), `page` (int), `limit` (int)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "problems": [
        {
          "id": "p_two_sum",
          "slug": "two-sum",
          "title": "Two Sum",
          "topic": "Hashing",
          "difficulty": "EASY",
          "estimatedMinutes": 10,
          "acceptanceRate": 48.5,
          "userStatus": "UNSEEN"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 4,
        "totalCount": 40
      }
    }
  }
  ```

### 4.2 Get Problem Details (Workspace Load)
- **Method & Path:** `GET /problems/{id_or_slug}`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": "p_two_sum",
      "slug": "two-sum",
      "title": "Two Sum",
      "topic": "Hashing",
      "difficulty": "EASY",
      "descriptionMarkdown": "Given an array of integers `nums` and an integer `target`...",
      "starterCode": "def two_sum(nums: list[int], target: int) -> list[int]:\n    # your code here\n    pass\n",
      "sampleTestCases": [
        {
          "input": "nums = [2,7,11,15], target = 9",
          "expectedOutput": "[0, 1]",
          "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      "constraints": [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists."
      ]
    }
  }
  ```

### 4.3 Reveal Progressive Hint
- **Method & Path:** `POST /problems/{id}/hints/{tier}`
- **URL Params:** `tier`: `1` (Conceptual), `2` (Pattern), `3` (Pseudocode)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "tier": 1,
      "hintTitle": "Conceptual Invariant",
      "hintMarkdown": "Instead of checking every pair with nested loops, consider what value is needed to reach `target` for any current number `x`."
    }
  }
  ```

---

## 5. Code Execution & Evaluation Endpoints

### 5.1 Run Sample Tests
- **Method & Path:** `POST /problems/{id}/run-sample`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "codeContent": "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i\n    return []\n",
    "language": "python"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "allPassed": true,
      "totalSamples": 2,
      "passedSamples": 2,
      "results": [
        {
          "sampleIndex": 1,
          "passed": true,
          "executionTimeMs": 14,
          "actualOutput": "[0, 1]",
          "expectedOutput": "[0, 1]",
          "stdout": ""
        }
      ]
    }
  }
  ```

### 5.2 Submit Solution (Idempotent Full Evaluation)
- **Method & Path:** `POST /problems/{id}/submit`
- **Headers:** `Idempotency-Key: c9df06eb-959c-4ecf-a8ea-8e998db42531`
- **Request Body:**
  ```json
  {
    "codeContent": "def two_sum(nums, target):\n    ...",
    "language": "python",
    "hintsUsedCount": 0
  }
  ```
- **Response (202 Accepted):**
  ```json
  {
    "success": true,
    "data": {
      "submissionId": "sub_99a8b1c2",
      "status": "QUEUED",
      "statusUrl": "/api/v1/submissions/sub_99a8b1c2/status"
    }
  }
  ```

### 5.3 Poll Submission Status
- **Method & Path:** `GET /submissions/{id}/status`
- **Response (200 OK - Finished State):**
  ```json
  {
    "success": true,
    "data": {
      "submissionId": "sub_99a8b1c2",
      "status": "COMPLETED",
      "verdict": "ACCEPTED",
      "passedTests": 12,
      "totalTests": 12,
      "runtimeMs": 48,
      "memoryKb": 14320,
      "masteryUpdate": {
        "topic": "Hashing",
        "previousMastery": 45.0,
        "newMastery": 56.0,
        "delta": 11.0
      },
      "nextRecommendation": {
        "problemId": "p_group_anagrams",
        "title": "Group Anagrams",
        "topic": "Hashing",
        "difficulty": "MEDIUM",
        "reasonCode": "STREAK_PROMOTION",
        "explanation": "You solved several easy hashing problems consecutively. Step up to medium."
      }
    }
  }
  ```

---

## 6. Dashboard & Mastery Analytics Endpoints

### 6.1 Get Dashboard Overview
- **Method & Path:** `GET /dashboard/overview`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "stats": {
        "problemsSolved": 12,
        "problemsAttempted": 18,
        "totalSubmissions": 30,
        "acceptedSubmissions": 12,
        "acceptanceRatePercent": 40.0,
        "acceptanceRateText": "12 accepted of 30 submissions (40%)",
        "currentStreakDays": 4
      },
      "recommendedNext": {
        "problemId": "p_two_sum",
        "slug": "two-sum",
        "title": "Two Sum",
        "topic": "Hashing",
        "difficulty": "EASY",
        "estimatedMinutes": 10,
        "reasonCode": "CONSOLIDATE_LEVEL",
        "explanation": "You're building solid foundations in Arrays. Try hashing to optimize time complexity."
      },
      "topicMasteries": [
        {
          "topicId": "t_arrays",
          "name": "Arrays",
          "score": 78.0,
          "status": "Confident",
          "isProvisional": false,
          "needsRevision": false
        },
        {
          "topicId": "t_strings",
          "name": "Strings",
          "score": 52.0,
          "status": "Developing",
          "isProvisional": false,
          "needsRevision": false
        },
        {
          "topicId": "t_searching",
          "name": "Searching",
          "score": 31.0,
          "status": "Needs Foundation",
          "isProvisional": false,
          "needsRevision": true
        }
      ],
      "recentActivity": [
        {
          "problemTitle": "Valid Palindrome",
          "verdict": "ACCEPTED",
          "timestamp": "2026-10-13T09:42:00Z"
        }
      ]
    }
  }
  ```

---

## 7. Telemetry & Analytics Ingestion Endpoint

### 7.1 Track Client Event
- **Method & Path:** `POST /events/track`
- **Request Body:**
  ```json
  {
    "eventName": "recommendation_opened",
    "properties": {
      "problemId": "p_two_sum",
      "reasonCode": "CONSOLIDATE_LEVEL",
      "source": "dashboard_hero_card"
    }
  }
  ```
- **Response (200 OK):**
  ```json
  { "success": true }
  ```
