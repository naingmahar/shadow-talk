import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini SDK with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { cvText } = await req.json();

    if (!cvText) {
      return NextResponse.json({ error: "CV text is required" }, { status: 400 });
    }

    // Using gemini-2.5-flash-lite for speed and efficiency
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        responseMimeType: "application/json", // Force JSON output
      }
    });

    const prompt = `
      Act as a professional career coach. Based on the following CV text, generate 10 interview preparation flashcards.
      
      CV TEXT:
      ${cvText}

      INSTRUCTIONS:
      1. Each card must have a "question" (front) and a "pro_answer" (back).
      2. Focus on technical skills mentioned in the CV and common behavioral questions.
      3. Keep the "pro_answer" concise but impactful, using "Power Words".
      4. Ensure the output is a valid JSON array of objects.

      OUTPUT FORMAT:
      [
        {
          "id": 1,
          "question": "string",
          "pro_answer": "string"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse the AI response to ensure it's valid JSON
    const flashcards = JSON.parse(responseText);

    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}



export const PROGRAMMER_FLASHCARDS = [
  // --- FRONTEND & WEB ---
  { id: 1, category: "Frontend", question: "What is the difference between Virtual DOM and Shadow DOM?" },
  { id: 2, category: "Frontend", question: "How do you optimize a React app that has too many re-renders?" },
  { id: 3, category: "Frontend", question: "Explain the 'Event Loop' in JavaScript." },
  { id: 4, category: "Frontend", question: "What is the difference between 'debouncing' and 'throttling'?" },
  { id: 5, category: "Frontend", question: "How does 'Next.js' handle Image Optimization?" },
  { id: 6, category: "Frontend", question: "What are 'Closures' and provide a real-world use case?" },
  { id: 7, category: "Frontend", question: "Difference between 'SSR' (Server Side Rendering) and 'SSG' (Static Site Generation)?" },
  { id: 8, category: "Frontend", question: "What is 'Hoisting' in JavaScript?" },
  { id: 9, category: "Frontend", question: "Explain 'Hydration' in the context of Next.js." },
  { id: 10, category: "Frontend", question: "How to prevent Layout Shift (CLS) on a web page?" },

  // --- BACKEND & DATABASE ---
  { id: 51, category: "Backend", question: "What is the difference between SQL and NoSQL?" },
  { id: 52, category: "Backend", question: "Explain 'ACID' properties in database transactions." },
  { id: 53, category: "Backend", question: "How does 'JWT' (JSON Web Token) authentication work?" },
  { id: 54, category: "Backend", question: "What is a 'Deadlock' and how can you prevent it?" },
  { id: 55, category: "Backend", question: "Explain the difference between 'PUT' and 'PATCH' in REST APIs." },
  { id: 56, category: "Backend", question: "What is 'Database Indexing' and why does it make queries faster?" },
  { id: 57, category: "Backend", question: "What is 'Rate Limiting' and how would you implement it?" },
  { id: 58, category: "Backend", question: "Explain 'Horizontal' vs 'Vertical' scaling." },
  { id: 59, category: "Backend", question: "What is the 'N+1 Query Problem' and how do you solve it?" },
  { id: 60, category: "Backend", question: "How do 'WebSockets' differ from traditional 'HTTP' requests?" },

  // --- CS FUNDAMENTALS & ALGORITHMS ---
  { id: 101, category: "Algorithms", question: "What is 'Big O' notation and why is it important?" },
  { id: 102, category: "Algorithms", question: "Difference between a 'Stack' and a 'Queue'?" },
  { id: 103, category: "Algorithms", question: "How does a 'Binary Search' algorithm work?" },
  { id: 104, category: "Algorithms", question: "Explain the 'Time Complexity' of Quick Sort vs Merge Sort." },
  { id: 105, category: "Algorithms", question: "What is a 'Hash Table' and how does it handle collisions?" },
  { id: 106, category: "Algorithms", question: "Explain the difference between 'Recursion' and 'Iteration'." },
  { id: 107, category: "Algorithms", question: "What is a 'Linked List' and when is it better than an Array?" },
  { id: 108, category: "Algorithms", question: "Describe 'Breadth-First Search' (BFS) vs 'Depth-First Search' (DFS)." },
  { id: 109, category: "Algorithms", question: "What is 'Dynamic Programming'?" },
  { id: 110, category: "Algorithms", question: "How do you detect a cycle in a Linked List?" },

  // --- BEHAVIORAL ---
  { id: 151, category: "Behavioral", question: "Tell me about a time you had a technical disagreement with a teammate." },
  { id: 152, category: "Behavioral", question: "How do you handle a situation where you are behind on a deadline?" },
  { id: 153, category: "Behavioral", question: "What is the most difficult bug you have ever fixed?" },
  { id: 154, category: "Behavioral", question: "How do you keep your technical skills up to date?" },
  { id: 155, category: "Behavioral", question: "Describe a project you are most proud of and your specific role in it." },
  { id: 156, category: "Behavioral", question: "What do you do when you don't know the answer to a technical problem?" },
  { id: 157, category: "Behavioral", question: "Tell me about a time you had to learn a new technology very quickly." },
  { id: 158, category: "Behavioral", question: "How do you handle constructive criticism during code reviews?" },
  { id: 159, category: "Behavioral", question: "What is your process for debugging a complex production issue?" },
  { id: 160, category: "Behavioral", question: "Why should we hire you over other candidates with similar skills?" },

  // --- MENTORING ---
  { id: 201, category: "Mentoring", question: "How do you provide constructive feedback to a junior developer whose code quality is consistently low?" },
  { id: 202, category: "Mentoring", question: "Describe your process for onboarding a new engineer to your technical stack." },
  { id: 203, category: "Mentoring", question: "How do you encourage a mentee to solve a problem themselves instead of giving them the answer?" },
  { id: 204, category: "Mentoring", question: "What do you do if a junior developer repeatedly makes the same mistake after you've corrected them?" },
  { id: 205, category: "Mentoring", question: "How do you identify which learning opportunities would be most valuable for different team members?" },
  { id: 206, category: "Mentoring", question: "How do you balance your own coding tasks with the time required to mentor others?" },
  { id: 207, category: "Mentoring", question: "What techniques do you use to explain complex system architecture to someone less experienced?" },
  { id: 208, category: "Mentoring", question: "How do you help a team member who is struggling with 'Imposter Syndrome'?" },

  // --- LEADERSHIP ---
  { id: 221, category: "Leadership", question: "How do you handle a situation where two senior engineers fundamentally disagree on a technical approach?" },
  { id: 222, category: "Leadership", question: "Tell me about a time you had to lead a team through a high-pressure production outage." },
  { id: 223, category: "Leadership", question: "How do you convince stakeholders to pause feature development to pay down technical debt?" },
  { id: 224, category: "Leadership", question: "What is your approach to managing a developer who is underperforming?" },
  { id: 225, category: "Leadership", question: "How do you maintain team morale during a period of shifting company priorities or layoffs?" },
  { id: 226, category: "Leadership", question: "Describe a time you led by example to change a team's culture or workflow." },
  { id: 227, category: "Leadership", question: "How do you ensure that quiet team members have their voices heard during architectural discussions?" },
  { id: 228, category: "Leadership", question: "How do you define 'Engineering Excellence' for your team?" },

  // --- PERSONAL & GROWTH ---
  { id: 241, category: "Personal", question: "Where do you see your technical career path in 5 years? (Individual Contributor vs. Management)" },
  { id: 242, category: "Personal", question: "What is the biggest professional mistake you’ve made, and what did you learn from it?" },
  { id: 243, category: "Personal", question: "How do you manage work-life balance when a project deadline is approaching?" },
  { id: 244, category: "Personal", question: "What are your 3 biggest strengths as a developer, and what is one area you are currently improving?" },
  { id: 245, category: "Personal", question: "Describe a non-technical hobby that has made you a better programmer." },
  { id: 246, category: "Personal", question: "What motivates you to keep coding every day besides the salary?" },
  { id: 247, category: "Personal", question: "How do you handle 'burnout' or periods of low motivation?" },
  { id: 248, category: "Personal", question: "What kind of work environment allows you to do your best work?" },
  
  // ... (Repeating the pattern for full 200 questions)

  { "id": 301, "category": "rn", "sub": "Architecture", "question": "What is the React Native Bridge and why is it a bottleneck?" },
  { "id": 302, "category": "rn", "sub": "Architecture", "question": "Explain the New Architecture: What are JSI, Fabric, and TurboModules?" },
  { "id": 303, "category": "rn", "sub": "Architecture", "question": "How does the Hermes engine improve app start-up time (TTI)?" },
  { "id": 304, "category": "rn", "sub": "Architecture", "question": "What is the difference between the JS Thread, UI Thread, and Shadow Thread?" },
  { "id": 305, "category": "rn", "sub": "Architecture", "question": "What is Yoga, and how does it translate Flexbox to native layouts?" },
  { "id": 306, "category": "rn", "sub": "Architecture", "question": "What is JSI (JavaScript Interface) and how does it allow synchronous calls?" },
  { "id": 307, "category": "rn", "sub": "Architecture", "question": "Explain Bridgeless Mode in React Native 0.73+." },
  { "id": 308, "category": "rn", "sub": "Architecture", "question": "How does Fabric improve the rendering performance of UI components?" },
  { "id": 309, "category": "rn", "sub": "Architecture", "question": "What is the role of Codegen in the New Architecture?" },
  { "id": 310, "category": "rn", "sub": "Architecture", "question": "How does React Native handle the 'Double Bridge' problem with animations?" },

  { "id": 311, "category": "rn", "sub": "Performance", "question": "How do you identify a Memory Leak in a React Native app?" },
  { "id": 312, "category": "rn", "sub": "Performance", "question": "Why is InteractionManager.runAfterInteractions useful for smooth UI transitions?" },
  { "id": 313, "category": "rn", "sub": "Performance", "question": "How would you optimize a FlatList with 5,000+ items?" },
  { "id": 314, "category": "rn", "sub": "Performance", "question": "What is the benefit of FlashList over the standard FlatList?" },
  { "id": 315, "category": "rn", "sub": "Performance", "question": "Explain the purpose of initialNumToRender and maxToRenderPerBatch in lists." },
  { "id": 316, "category": "rn", "sub": "Performance", "question": "How do you use the 'Profiler' to find components causing slow re-renders?" },
  { "id": 317, "category": "rn", "sub": "Performance", "question": "Why should you avoid using anonymous functions inside the render/return block?" },
  { "id": 318, "category": "rn", "sub": "Performance", "question": "What is the impact of console.log statements on production performance?" },
  { "id": 319, "category": "rn", "sub": "Performance", "question": "How do you reduce the JS Bundle size for a production build?" },
  { "id": 320, "category": "rn", "sub": "Performance", "question": "What is the difference between useMemo and useCallback in RN performance?" },

  { "id": 321, "category": "rn", "sub": "State", "question": "When would you choose Zustand over Redux Toolkit in 2026?" },
  { "id": 322, "category": "rn", "sub": "State", "question": "How does the Context API compare to Redux regarding re-rendering behavior?" },
  { "id": 323, "category": "rn", "sub": "State", "question": "What is React Query and why is it preferred for server-state management?" },
  { "id": 324, "category": "rn", "sub": "State", "question": "How do you persist state across app restarts using MMKV?" },
  { "id": 325, "category": "rn", "sub": "State", "question": "Explain the 'Offline Sync' pattern for mobile form submissions." },
  { "id": 326, "category": "rn", "sub": "State", "question": "What is the difference between useState and useRef for tracking non-UI values?" },
  { "id": 327, "category": "rn", "sub": "State", "question": "How do you handle 'Prop Drilling' without using a global state library?" },
  { "id": 328, "category": "rn", "sub": "State", "question": "Explain how to use useLayoutEffect to prevent UI flickering in RN." },
  { "id": 329, "category": "rn", "sub": "State", "question": "How do you create a custom hook to detect network connectivity status?" },
  { "id": 330, "category": "rn", "sub": "State", "question": "What is useImperativeHandle and when should you use it with Ref?" },

  { "id": 331, "category": "rn", "sub": "Styling", "question": "How do you handle different screen densities using PixelRatio?" },
  { "id": 332, "category": "rn", "sub": "Styling", "question": "What is the difference between 'flex: 1' in RN vs standard Web CSS?" },
  { "id": 333, "category": "rn", "sub": "Styling", "question": "How do you implement Dynamic Dark Mode in React Native?" },
  { "id": 334, "category": "rn", "sub": "Styling", "question": "What are Safe Area Insets and why are they critical for 'Notch' devices?" },
  { "id": 335, "category": "rn", "sub": "Styling", "question": "How do you create a responsive layout that works on both iPhone and Tablets?" },
  { "id": 336, "category": "rn", "sub": "Styling", "question": "How do you handle RTL (Right-to-Left) layouts for specific languages?" },
  { "id": 337, "category": "rn", "sub": "Styling", "question": "What is the benefit of using aspectRatio over fixed width/height?" },
  { "id": 338, "category": "rn", "sub": "Styling", "question": "How do you conditionally apply styles based on Platform.OS (iOS vs Android)?" },
  { "id": 339, "category": "rn", "sub": "Styling", "question": "Explain the difference in Z-Index behavior between Android and iOS." },
  { "id": 340, "category": "rn", "sub": "Styling", "question": "Why is StyleSheet.create preferred over inline style objects?" },

  { "id": 341, "category": "rn", "sub": "Native", "question": "How do you create a Native Module for iOS using Swift?" },
  { "id": 342, "category": "rn", "sub": "Native", "question": "How do you create a Native Module for Android using Kotlin?" },
  { "id": 343, "category": "rn", "sub": "Native", "question": "What is the difference between Expo Managed Workflow and Bare Workflow?" },
  { "id": 344, "category": "rn", "sub": "Native", "question": "What is an Expo Config Plugin and when do you need one?" },
  { "id": 345, "category": "rn", "sub": "Native", "question": "Explain the purpose of the Podfile and Podfile.lock in iOS." },
  { "id": 346, "category": "rn", "sub": "Native", "question": "What is Auto-linking and how does it work under the hood?" },
  { "id": 347, "category": "rn", "sub": "Native", "question": "How do you pass data from Native code back to JavaScript using Events?" },
  { "id": 348, "category": "rn", "sub": "Native", "question": "What is the 'Prebuild' command in Expo and what does it do?" },
  { "id": 349, "category": "rn", "sub": "Native", "question": "How do you link a 3rd-party C++ library to a React Native project?" },
  { "id": 350, "category": "rn", "sub": "Native", "question": "What are JSI Host Objects and how do they replace the old bridge maps?" },

  { "id": 351, "category": "rn", "sub": "Animations", "question": "Why is useNativeDriver: true essential for the standard Animated API?" },
  { "id": 352, "category": "rn", "sub": "Animations", "question": "What are Shared Values in Reanimated 3 and how do they work?" },
  { "id": 353, "category": "rn", "sub": "Animations", "question": "How do you use Skia in React Native for high-performance 2D graphics?" },
  { "id": 354, "category": "rn", "sub": "Animations", "question": "What is the difference between Layout Animations and Frame-based animations?" },
  { "id": 355, "category": "rn", "sub": "Animations", "question": "How do you handle complex gestures with React Native Gesture Handler?" },
  { "id": 356, "category": "rn", "sub": "Animations", "question": "How do you animate a 'Header' that shrinks as the user scrolls?" },
  { "id": 357, "category": "rn", "sub": "Animations", "question": "What is a PanResponder and when would you still use it today?" },
  { "id": 358, "category": "rn", "sub": "Animations", "question": "How do you use Lottie for vector animations in React Native?" },
  { "id": 359, "category": "rn", "sub": "Animations", "question": "Explain Worklets in the context of Reanimated." },
  { "id": 360, "category": "rn", "sub": "Animations", "question": "How do you create a 'Parallax' effect in a ScrollView?" },

  { "id": 361, "category": "rn", "sub": "Navigation", "question": "What is the difference between Stack, Tab, and Drawer navigators?" },
  { "id": 362, "category": "rn", "sub": "Navigation", "question": "How do you handle Deep Linking and Universal Links in React Navigation?" },
  { "id": 363, "category": "rn", "sub": "Navigation", "question": "What is the Navigation Container and why is it at the root?" },
  { "id": 364, "category": "rn", "sub": "Navigation", "question": "How do you prevent a user from going back after a successful login?" },
  { "id": 365, "category": "rn", "sub": "Navigation", "question": "Explain how to use useFocusEffect instead of useEffect for screens." },
  { "id": 366, "category": "rn", "sub": "Navigation", "question": "How do you implement Nested Navigation structures?" },
  { "id": 367, "category": "rn", "sub": "Navigation", "question": "How do you pass parameters to a screen without making them stale?" },
  { "id": 368, "category": "rn", "sub": "Navigation", "question": "How do you track screen views for Analytics using Navigation state?" },
  { "id": 369, "category": "rn", "sub": "Navigation", "question": "What is the benefit of using Native Stack over the JS-based Stack?" },
  { "id": 370, "category": "rn", "sub": "Navigation", "question": "How do you create a custom reusable Header for all screens?" },

  { "id": 371, "category": "rn", "sub": "Deployment", "question": "What is a Phased Release (iOS) and a Staged Rollout (Android)?" },
  { "id": 372, "category": "rn", "sub": "Deployment", "question": "How do you handle App Store rejection for 'Sign in with Apple' requirements?" },
  { "id": 373, "category": "rn", "sub": "Deployment", "question": "What is Code Push and what are the Apple/Google legal limitations?" },
  { "id": 374, "category": "rn", "sub": "Deployment", "question": "How do you manage App Versioning vs Build Numbers in a team?" },
  { "id": 375, "category": "rn", "sub": "Deployment", "question": "What are Privacy Manifests in iOS 17+ and why do they matter?" },
  { "id": 376, "category": "rn", "sub": "Deployment", "question": "Explain the difference between a Debug APK and a Signed AAB bundle." },
  { "id": 377, "category": "rn", "sub": "Deployment", "question": "What is Google Play Data Safety and how do you declare SDK usage?" },
  { "id": 378, "category": "rn", "sub": "Deployment", "question": "How do you use TestFlight for external beta testing?" },
  { "id": 379, "category": "rn", "sub": "Deployment", "question": "What is Fastlane and how does it automate store uploads?" },
  { "id": 380, "category": "rn", "sub": "Deployment", "question": "How do you handle In-App Purchases (IAP) logic and receipts?" },

  { "id": 381, "category": "rn", "sub": "Testing", "question": "What is the difference between Jest (Unit) and Detox (E2E) testing?" },
  { "id": 382, "category": "rn", "sub": "Testing", "question": "How do you mock a native module like AsyncStorage in Jest?" },
  { "id": 383, "category": "rn", "sub": "Testing", "question": "What is React Native Testing Library and why use it over Enzyme?" },
  { "id": 384, "category": "rn", "sub": "Testing", "question": "How do you debug Native Crashes using Xcode and Android Studio?" },
  { "id": 385, "category": "rn", "sub": "Testing", "question": "What are Source Maps and how do you use them with Sentry?" },
  { "id": 386, "category": "rn", "sub": "Testing", "question": "How do you simulate 'Low Memory' or 'No Network' in an emulator?" },
  { "id": 387, "category": "rn", "sub": "Testing", "question": "What is a Snapshot Test and when is it actually useful?" },
  { "id": 388, "category": "rn", "sub": "Testing", "question": "How do you debug Layout issues using the Flipper Layout Inspector?" },
  { "id": 389, "category": "rn", "sub": "Testing", "question": "How do you test a component that uses custom hooks?" },
  { "id": 390, "category": "rn", "sub": "Testing", "question": "Explain the Red-Green-Refactor cycle in TDD for Mobile." },

  { "id": 391, "category": "rn", "sub": "Security", "question": "How do you securely store sensitive API tokens in React Native?" },
  { "id": 392, "category": "rn", "sub": "Security", "question": "What is SSL Pinning and why is it used for fintech apps?" },
  { "id": 393, "category": "rn", "sub": "Security", "question": "How do you implement Biometric Auth (FaceID/Fingerprint) in RN?" },
  { "id": 394, "category": "rn", "sub": "Security", "question": "What is the difference between iOS Keychain and Android Keystore?" },
  { "id": 395, "category": "rn", "sub": "Security", "question": "How do you prevent 'Man-in-the-Middle' attacks in mobile apps?" },
  { "id": 396, "category": "rn", "sub": "Security", "question": "Explain JWT refresh token logic to keep a user logged in safely." },
  { "id": 397, "category": "rn", "sub": "Security", "question": "What is Code Obfuscation (Proguard/DexGuard) and do you need it?" },
  { "id": 398, "category": "rn", "sub": "Security", "question": "How do you handle Certificate Pinning updates without breaking the app?" },
  { "id": 399, "category": "rn", "sub": "Security", "question": "How do you protect your app against running on Rooted/Jailbroken devices?" },
  { "id": 400, "category": "rn", "sub": "Security", "question": "What is the best way to handle App Permissions (Camera/Location) in 2026?" },

];

export const FUNCTIONAL_ENGLISH_FLASHCARDS = [
  { "id": 501, "category": "ielts", "sub": "Work/Study", "question": "What are you studying at the moment?" },
  { "id": 502, "category": "ielts", "sub": "Work/Study", "question": "What is the most difficult part of your job?" },
  { "id": 503, "category": "ielts", "sub": "Work/Study", "question": "Is there anything you would like to change about your workplace?" },
  { "id": 504, "category": "ielts", "sub": "Hometown", "question": "What is the most interesting part of your hometown?" },
  { "id": 505, "category": "ielts", "sub": "Hometown", "question": "How has your hometown changed since you were a child?" },
  { "id": 506, "category": "ielts", "sub": "Daily Routine", "question": "What is your favorite part of the day?" },
  { "id": 507, "category": "ielts", "sub": "Daily Routine", "question": "Do you think it is important to have a daily routine?" },
  { "id": 508, "category": "ielts", "sub": "Technology", "question": "How often do you use social media?" },
  { "id": 509, "category": "ielts", "sub": "Technology", "question": "Do you think people spend too much time on their phones these days?" },
  { "id": 510, "category": "ielts", "sub": "Leisure", "question": "What do you usually do on your weekends?" },

  { "id": 511, "category": "ielts", "sub": "Food", "question": "What is your favorite type of cuisine?" },
  { "id": 512, "category": "ielts", "sub": "Food", "question": "Do you prefer eating at home or at a restaurant?" },
  { "id": 513, "category": "ielts", "sub": "Travel", "question": "What is the most beautiful place you have ever visited?" },
  { "id": 514, "category": "ielts", "sub": "Travel", "question": "Do you prefer traveling alone or with a group of friends?" },
  { "id": 515, "category": "ielts", "sub": "Environment", "question": "What are the main environmental problems in your country?" },
  { "id": 516, "category": "ielts", "sub": "Environment", "question": "How can individuals help protect the environment?" },
  { "id": 517, "category": "ielts", "sub": "Education", "question": "Do you think children should start learning a second language at a young age?" },
  { "id": 518, "category": "ielts", "sub": "Education", "question": "What qualities make a good teacher?" },
  { "id": 519, "category": "ielts", "sub": "Friends", "question": "How much time do you spend with your friends?" },
  { "id": 520, "category": "ielts", "sub": "Friends", "question": "What do you look for in a good friend?" },

  { "id": 521, "category": "ielts", "sub": "Art", "question": "Are you interested in art?" },
  { "id": 522, "category": "ielts", "sub": "Art", "question": "Have you ever been to an art gallery?" },
  { "id": 523, "category": "ielts", "sub": "Weather", "question": "What kind of weather do you like the most?" },
  { "id": 524, "category": "ielts", "sub": "Weather", "question": "Does the weather ever affect your mood?" },
  { "id": 525, "category": "ielts", "sub": "Hobby", "question": "What hobbies were popular in your country when you were a child?" },
  { "id": 526, "category": "ielts", "sub": "Hobby", "question": "Is it important for people to have a hobby?" },
  { "id": 527, "category": "ielts", "sub": "Sports", "question": "What is the most popular sport in your country?" },
  { "id": 528, "category": "ielts", "sub": "Sports", "question": "Do you prefer watching sports or playing them?" },
  { "id": 529, "category": "ielts", "sub": "Shopping", "question": "Do you enjoy shopping for clothes?" },
  { "id": 530, "category": "ielts", "sub": "Shopping", "question": "Is online shopping better than going to physical stores?" },

  { "id": 531, "category": "ielts", "sub": "Music", "question": "What kind of music do you listen to when you are stressed?" },
  { "id": 532, "category": "ielts", "sub": "Music", "question": "Have you ever learned to play a musical instrument?" },
  { "id": 533, "category": "ielts", "sub": "Transport", "question": "What is the most common form of transport in your city?" },
  { "id": 534, "category": "ielts", "sub": "Transport", "question": "Should public transport be free for everyone?" },
  { "id": 535, "category": "ielts", "sub": "History", "question": "Are you interested in learning about the history of your country?" },
  { "id": 536, "category": "ielts", "sub": "History", "question": "What historical event has shaped the world the most?" },
  { "id": 537, "category": "ielts", "sub": "Dreams", "question": "Do you often remember your dreams?" },
  { "id": 538, "category": "ielts", "sub": "Dreams", "question": "Do you think dreams have any special meaning?" },
  { "id": 539, "category": "ielts", "sub": "Animals", "question": "Are you a fan of wild animals?" },
  { "id": 540, "category": "ielts", "sub": "Animals", "question": "Should animals be kept in zoos?" },

  { "id": 541, "category": "ielts", "sub": "Future", "question": "What are your plans for the next few years?" },
  { "id": 542, "category": "ielts", "sub": "Future", "question": "How do you think the world will change in the next 50 years?" },
  { "id": 543, "category": "ielts", "sub": "Happiness", "question": "What makes you feel truly happy?" },
  { "id": 544, "category": "ielts", "sub": "Happiness", "question": "Can money buy happiness?" },
  { "id": 545, "category": "ielts", "sub": "Culture", "question": "What is the most famous festival in your country?" },
  { "id": 546, "category": "ielts", "sub": "Culture", "question": "Is it important to maintain traditional culture?" },
  { "id": 547, "category": "ielts", "sub": "Cities", "question": "Do you prefer living in a big city or the countryside?" },
  { "id": 548, "category": "ielts", "sub": "Cities", "question": "What are the disadvantages of living in a crowded city?" },
  { "id": 549, "category": "ielts", "sub": "Ambition", "question": "What was your dream job when you were a child?" },
  { "id": 550, "category": "ielts", "sub": "Ambition", "question": "Is it better to be ambitious or to be satisfied with what you have?" },
  { "id": 551, "category": "ielts", "sub": "Cooking", "question": "Do you enjoy cooking? Why or why not?" },
  { "id": 552, "category": "ielts", "sub": "Cooking", "question": "Who usually does the cooking in your home?" },
  { "id": 553, "category": "ielts", "sub": "Cooking", "question": "What was the last meal you cooked for yourself?" },
  { "id": 554, "category": "ielts", "sub": "Cooking", "question": "Is it important for children to learn how to cook at school?" },

  { "id": 555, "category": "ielts", "sub": "Introduction", "question": "Could you tell me your full name and where you are from?" },
  { "id": 556, "category": "ielts", "sub": "Introduction", "question": "How would your friends describe your personality?" },
  { "id": 557, "category": "ielts", "sub": "Passion", "question": "What is something you are truly passionate about?" },
  { "id": 558, "category": "ielts", "sub": "Mentality", "question": "How do you stay positive when things go wrong?" },
  { "id": 559, "category": "ielts", "sub": "Mentality", "question": "Do you consider yourself an introvert or an extrovert?" },

  { "id": 560, "category": "ielts", "sub": "Hotel Booking", "question": "I'd like to book a room for three nights. What is your nightly rate?" },
  { "id": 561, "category": "ielts", "sub": "Hotel Booking", "question": "Does the room come with breakfast and free Wi-Fi?" },
  { "id": 562, "category": "ielts", "sub": "Hotel Booking", "question": "Is it possible to have an early check-in or a late check-out?" },

  { "id": 563, "category": "ielts", "sub": "Immigration", "question": "What is the purpose of your visit to this country?" },
  { "id": 564, "category": "ielts", "sub": "Immigration", "question": "How long do you plan to stay, and where will you be residing?" },
  { "id": 565, "category": "ielts", "sub": "Immigration", "question": "Can you provide proof of your return flight and travel insurance?" },

  { "id": 566, "category": "ielts", "sub": "Restaurant", "question": "Could we have a table for two by the window, please?" },
  { "id": 567, "category": "ielts", "sub": "Restaurant", "question": "What do you recommend from the menu today?" },
  { "id": 568, "category": "ielts", "sub": "Restaurant", "question": "I have a food allergy; can this dish be made without nuts?" },
  { "id": 569, "category": "ielts", "sub": "Restaurant", "question": "Could we have the bill, please? Do you accept credit cards?" },

  { "id": 570, "category": "ielts", "sub": "Shopping", "question": "Do you have this shirt in a medium size and a different color?" },
  { "id": 571, "category": "ielts", "sub": "Shopping", "question": "Where are the fitting rooms located?" },
  { "id": 572, "category": "ielts", "sub": "Daily Life", "question": "How do you usually get to work or school every morning?" },
  { "id": 573, "category": "ielts", "sub": "Daily Life", "question": "What is the first thing you do when you wake up?" },
  { "id": 574, "category": "ielts", "sub": "Passion", "question": "If money was not an issue, what would you spend your life doing?" },
  { "id": 575, "category": "ielts", "sub": "Passion", "question": "What is a skill you’ve always wanted to learn but haven't started yet?" },
  { "id": 576, "category": "ielts", "sub": "Passion", "question": "Do you prefer hobbies that are creative or hobbies that are physical?" },
  { "id": 577, "category": "ielts", "sub": "Passion", "question": "Who is someone you admire because of their dedication to their work?" },
  { "id": 578, "category": "ielts", "sub": "Passion", "question": "What is the most rewarding thing about your current project or hobby?" },
  { "id": 579, "category": "ielts", "sub": "Passion", "question": "How do you find time for your passions during a busy work week?" },
  { "id": 580, "category": "ielts", "sub": "Passion", "question": "Is it better to have one deep passion or many small interests?" },

  { "id": 581, "category": "ielts", "sub": "Mentality", "question": "How do you handle stress when you have a very long to-do list?" },
  { "id": 582, "category": "ielts", "sub": "Mentality", "question": "What does 'success' mean to you personally?" },
  { "id": 583, "category": "ielts", "sub": "Mentality", "question": "Do you prefer to plan everything in advance or go with the flow?" },
  { "id": 584, "category": "ielts", "sub": "Mentality", "question": "What is the best piece of advice you have ever received?" },
  { "id": 585, "category": "ielts", "sub": "Mentality", "question": "How do you react when someone gives you unexpected criticism?" },
  { "id": 586, "category": "ielts", "sub": "Mentality", "question": "Do you think it's important to step out of your comfort zone often?" },
  { "id": 587, "category": "ielts", "sub": "Mentality", "question": "How do you stay motivated when learning a difficult new language?" },

  { "id": 588, "category": "ielts", "sub": "Hotel Booking", "question": "Is there a shuttle service from the airport to the hotel?" },
  { "id": 589, "category": "ielts", "sub": "Hotel Booking", "question": "I have a reservation under the name 'John Smith'. Is the room ready?" },
  { "id": 590, "category": "ielts", "sub": "Hotel Booking", "question": "Can I leave my luggage here for a few hours after I check out?" },
  { "id": 591, "category": "ielts", "sub": "Hotel Booking", "question": "Does the room have a safe for my valuables?" },
  { "id": 592, "category": "ielts", "sub": "Hotel Booking", "question": "The air conditioning in my room isn't working; could you send someone to check it?" },
  { "id": 593, "category": "ielts", "sub": "Hotel Booking", "question": "Could I have some extra towels and a bottle of water sent to my room?" },
  { "id": 594, "category": "ielts", "sub": "Hotel Booking", "question": "What time is the latest I can check out without extra charges?" },

  { "id": 595, "category": "ielts", "sub": "Immigration", "question": "Are you traveling alone or with family members?" },
  { "id": 596, "category": "ielts", "sub": "Immigration", "question": "Do you have any items to declare, such as food or electronics?" },
  { "id": 597, "category": "ielts", "sub": "Immigration", "question": "How much currency are you carrying with you today?" },
  { "id": 598, "category": "ielts", "sub": "Immigration", "question": "Is this your first time visiting this country?" },
  { "id": 599, "category": "ielts", "sub": "Immigration", "question": "What is your occupation back in your home country?" },
  { "id": 600, "category": "ielts", "sub": "Immigration", "question": "Can I see your hotel reservation or invitation letter?" },
  { "id": 601, "category": "ielts", "sub": "Immigration", "question": "Do you have a return ticket booked?" },

  { "id": 602, "category": "ielts", "sub": "Restaurant", "question": "Do you have any vegetarian or vegan options available?" },
  { "id": 603, "category": "ielts", "sub": "Restaurant", "question": "Is there a long wait for a table of four?" },
  { "id": 604, "category": "ielts", "sub": "Restaurant", "question": "Could we see the dessert menu, please?" },
  { "id": 605, "category": "ielts", "sub": "Restaurant", "question": "What are the ingredients in this specific dish?" },
  { "id": 606, "category": "ielts", "sub": "Restaurant", "question": "Excuse me, I ordered my steak medium-rare, but this is well-done." },
  { "id": 607, "category": "ielts", "sub": "Restaurant", "question": "Could we have some more water and napkins for the table?" },
  { "id": 608, "category": "ielts", "sub": "Restaurant", "question": "Is service charge included in the bill, or should I leave a tip?" },

  { "id": 609, "category": "ielts", "sub": "Daily Routine", "question": "What is the most productive hour of your day?" },
  { "id": 610, "category": "ielts", "sub": "Daily Routine", "question": "Do you listen to music or podcasts during your commute?" },
  { "id": 611, "category": "ielts", "sub": "Daily Routine", "question": "How much sleep do you need to feel fully rested?" },
  { "id": 612, "category": "ielts", "sub": "Social", "question": "What is the best way to make new friends in a city you just moved to?" },
  { "id": 613, "category": "ielts", "sub": "Social", "question": "Do you enjoy attending large parties or small gatherings more?" },
  { "id": 614, "category": "ielts", "sub": "Travel", "question": "Would you rather travel to a snowy mountain or a tropical beach?" },
  { "id": 615, "category": "ielts", "sub": "Travel", "question": "What is the most essential item in your suitcase when you travel?" },
  { "id": 616, "category": "ielts", "sub": "Future", "question": "What is one thing you hope to achieve by the end of this year?" },
  { "id": 617, "category": "ielts", "sub": "Future", "question": "If you could live anywhere in the world, where would it be?" },
  { "id": 618, "category": "ielts", "sub": "Shopping", "question": "I’m looking for a gift for a friend; do you have any suggestions?" },
  { "id": 619, "category": "ielts", "sub": "Shopping", "question": "Can I return this item if it doesn't fit or if I change my mind?" },
  { "id": 620, "category": "ielts", "sub": "Shopping", "question": "Is there a discount if I buy more than one of these?" },
  { "id": 621, "category": "ielts", "sub": "Health", "question": "How do you stay active when you have to sit at a desk all day?" },
  { "id": 622, "category": "ielts", "sub": "Health", "question": "Do you prefer home-cooked meals or healthy takeout options?" },
  { "id": 623, "category": "ielts", "sub": "Health", "question": "What is your favorite way to decompress after a long shift?" },
] 