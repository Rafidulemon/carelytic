import type { Translations } from "./types";

export const en = {
  common: {
    brand: "Carelytic",
    beta: "Beta",
    language: {
      label: "Language",
      english: "English",
      bengali: "বাংলা",
    },
    nav: {
      home: "Home",
      upload: "Upload",
      about: "About",
      payments: "Payments",
      account: "Account",
    },
    statuses: {
      normal: "Normal",
      attention: "Attention",
    },
    actions: {
      logIn: "Log in",
      signUp: "Sign up",
      newUpload: "New upload",
      viewAccount: "View account",
      viewDetails: "View report details",
      analyzeAnother: "Analyze another",
      logOut: "Log out",
      close: "Close",
    },
    credits: {
      label: "credits",
      balance: "Current balance",
    },
  },
  navbar: {
    ariaMenu: "Toggle navigation",
    text: {
      signedIn: "Signed in",
      signedInAs: "Signed in as",
      balance: "Balance",
      reportsAnalyzed: {
        single: "{{count}} report analyzed",
        plural: "{{count}} reports analyzed",
      },
      recentUploads: "Recent uploads",
    },
  },
  footer: {
    tagline:
      "AI that understands your medical language and translates it into clarity.",
    links: {
      about: "About",
      upload: "Upload",
      privacy: "Privacy Policy",
      contact: "Contact",
    },
    copyright: "© {{year}} Carelytic. All rights reserved.",
  },
  home: {
    hero: {
      badge: "Trusted AI for healthcare data",
      titleLead: "AI that understands",
      titleHighlight: "your medical reports",
      description:
        "Carelytic transforms complex lab results and clinician notes into a guided experience. Upload your reports, interpret them in plain language, and surface actionable health insights — all in one secure workspace.",
      primaryCta: "Get Started",
      secondaryCta: "Meet the team",
      metrics: [
        {
          label: "Turnaround time",
          value: "< 30",
          suffix: "seconds per report",
        },
        {
          label: "Insights flagged",
          value: "3.2",
          suffix: "avg potential alerts",
        },
      ],
    },
    previewCard: {
      latestReportLabel: "Latest report",
      latestReportName: "Blood chemistry",
      status: "Stable",
      insightBadge: "Carelytic insight",
      insightCopy:
        "Mildly elevated glucose detected. Consider a follow-up fasting test and share insights with your physician.",
      itemReady: "Ready",
    },
    featuresSection: {
      label: "Why Carelytic",
      heading: "Built for clarity and clinical rigor",
      description:
        "We blend medical-grade accuracy with approachable design so patients and care teams can stay aligned. Explore the core capabilities powering Carelytic.",
      items: [
        {
          title: "Upload Reports",
          description:
            "Securely upload PDFs or images in seconds with drag-and-drop, automatic file validation, and zero vendor lock-in.",
        },
        {
          title: "AI Interpretation",
          description:
            "Turn clinical jargon into patient-friendly summaries fueled by Carelytic’s healthcare-specific language models.",
        },
        {
          title: "Health Insights",
          description:
            "Spot trends, risks, and next-step suggestions instantly with color-coded dashboards designed for clinicians and patients.",
        },
      ],
    },
    doctorsSection: {
      label: "Doctors trust Carelytic",
      heading: "Voices from Bangladeshi clinicians",
      description:
        "Medical experts across Bangladesh use Carelytic to empower clearer patient conversations and faster clinical decisions.",
      quotes: [
        {
          name: "Dr. Nusrat Hossain",
          role: "Consultant Cardiologist, Dhaka Medical College",
          quote:
            "Carelytic delivers the kind of concise report summaries I want my patients to carry into every consultation.",
        },
        {
          name: "Prof. Tanvir Ahmed",
          role: "Head of Pathology, Chattogram General Hospital",
          quote:
            "The AI-highlighted risks align closely with our lab interpretations, helping us prioritise follow-up cases faster.",
        },
        {
          name: "Dr. Mitali Das",
          role: "Family Physician, Sylhet",
          quote:
            "I’ve seen anxiety drop when patients arrive with Carelytic insights—it bridges the language gap of medical reports.",
        },
      ],
    },
  },
  upload: {
    hero: {
      badge: "Upload medical reports",
      heading: "Bring your reports to life in seconds",
      description:
        "Carelytic extracts and interprets the metrics that matter. Upload any lab, imaging, or clinical report — our AI highlights key values, trends, and recommended follow-ups.",
      infoLink: "How it works",
    },
    steps: [
      {
        label: "Upload",
        description: "Drag & drop or select a medical report file.",
      },
      {
        label: "Analyze",
        description:
          "Carelytic scans values, flags anomalies, and drafts summaries.",
      },
      {
        label: "Share",
        description:
          "Export insights or share them securely with your care team.",
      },
    ],
  },
  about: {
    badge: "About Carelytic",
    heading: "We believe clarity transforms healthcare decisions",
    intro:
      "Carelytic was founded by clinicians, engineers, and designers who have seen how overwhelming medical reports can be for patients and time-strapped providers. We built Carelytic to empower proactive, informed conversations around your health data.",
    mission: {
      heading: "Our mission",
      points: [
        "Translate complex lab values into language people understand without losing clinical precision.",
        "Equip care teams with AI summaries that save time and surface the right follow-up actions.",
        "Respect patient privacy with on-device preprocessing and secure, encrypted workflows.",
      ],
    },
    building: {
      heading: "What we’re building",
      paragraphs: [
        "Carelytic blends advanced natural language processing with trusted medical datasets to deliver insights you can act on. From lab trends to imaging notes, our platform surfaces what matters, suggests next steps, and keeps clinicians in the loop. Transparency, accuracy, and compassion guide every product decision.",
        "We partner with health systems and research institutions to ensure Carelytic meets the highest bar for safety and compliance — because precision and trust are non-negotiable in healthcare.",
      ],
    },
    team: {
      heading: "Meet the team leading Carelytic",
      description:
        "Diverse expertise in clinical practice, AI research, and human-centered design fuels our commitment to better health communication.",
      members: [
        {
          name: "Dr. Maya Chen",
          title: "Chief Medical Officer",
          bio: "Board-certified internist with 12 years in hospital medicine, leading clinical validation at Carelytic.",
        },
        {
          name: "Leo Martinez",
          title: "Head of Product",
          bio: "Former product lead at a digital therapeutics startup, passionate about building empathetic health software.",
        },
        {
          name: "Anika Patel",
          title: "Lead ML Engineer",
          bio: "Specializes in multimodal medical AI and responsible model deployment across regulated environments.",
        },
      ],
      footerTag: "Healthcare AI · Responsible innovation · Patient empathy",
    },
  },
  plans: {
    payg: {
      title: "Pay as you go",
      price: "BDT 10 / report",
      description:
        "Perfect for occasional uploads. Pay BDT 10 each time you unlock a report.",
      highlight: "Standard pricing, no commitment.",
    },
    monthly: {
      title: "Monthly subscription",
      price: "BDT 100 / month",
      description:
        "Includes 120 credits every month (covers 12 reports). Save about 20% overall.",
      highlight:
        "Auto-renews monthly. Unused credits roll forward for 90 days.",
    },
    yearly: {
      title: "Yearly subscription",
      price: "BDT 1,000 / year",
      description:
        "Receive 1,500 credits upfront (~150 reports). The best value for regular users.",
      highlight: "Single annual payment with the biggest credit bonus.",
    },
  },
  payment: {
    hero: {
      badge: "Payments & pricing",
      heading: "Unlock insights with simple, transparent pricing",
      description:
        "Every report costs <strong>BDT 10</strong> (or <strong>10 credits</strong>). Top up with monthly or yearly subscriptions to save 20% and get instant access to Carelytic’s AI interpretations.",
      balanceLabel: "Your current balance",
      planLabel: "Plan",
      guestLabel: "Guest",
      saveCallout: {
        title: "Save with subscriptions",
        message:
          "Monthly plan: BDT 100 → 120 credits | Yearly plan: BDT 1,000 → 1,500 credits",
      },
    },
    paymentOptions: {
      bkash: {
        label: "bKash",
        description:
          "Instant mobile payment via bKash personal or merchant accounts.",
      },
      nagad: {
        label: "Nagad",
        description: "Pay using your Nagad wallet with one-tap confirmation.",
      },
      card: {
        label: "Debit/Credit Card",
        description: "Visa, Mastercard, and local cards accepted.",
      },
    },
    payg: {
      heading: "Pay as you go",
      description:
        "Ideal for ad-hoc uploads. Each unlocked report costs <strong>BDT 10</strong>. Choose your preferred Bangladeshi payment method below.",
      status: {
        processingCard: "Processing secure card payment...",
        redirecting: "Redirecting to {{method}} checkout...",
        loginRequired:
          "Please log in to complete payment and have credits automatically applied.",
        success:
          "Payment successful! Your report will unlock automatically after processing.",
      },
      note: "After successful payment, you’ll be redirected back to Carelytic and your report unlocks instantly.",
    },
    subscriptions: {
      heading: "Subscription bundles",
      description:
        "Save 20% compared to pay-as-you-go. Subscribers receive credits up front and redeem <strong>10 credits</strong> per report. Plans renew automatically; cancel anytime.",
      includes: "Includes {{credits}} credits",
      includesNone: "no prepaid credits",
      buy: "Buy {{plan}}",
      currentPlan: "Current plan",
      choosePlan: "Choose plan",
      statusProcessing: "Preparing secure payment checkout...",
      statusSuccess:
        "Subscription activated! {{credits}} credits added to your balance. Your plan renews automatically.",
      note: "Credits renew when your subscription is charged. Yearly plans provide the biggest upfront credit bundle for clinics and high-volume users.",
    },
    faq: {
      heading: "Payment FAQs",
      items: [
        {
          question: "Can I mix pay-as-you-go and credits?",
          answer:
            "Yes. You can pay BDT 10 at any time, and also maintain a subscription for steady savings. Credits only deduct when available.",
        },
        {
          question: "What happens if I cancel my subscription?",
          answer:
            "You keep any remaining credits until they expire (90 days for monthly, 180 days for yearly). Future renewals stop immediately.",
        },
        {
          question: "Do credits roll over?",
          answer:
            "Monthly credits roll forward for 90 days, yearly credits for 180 days. After that, unused credits expire.",
        },
        {
          question: "How soon is my report unlocked?",
          answer:
            "Instantly. As soon as payment is confirmed or credits are redeemed, your report summary becomes available.",
        },
      ],
    },
  },
  account: {
    unauthenticated: {
      heading: "Sign in to view your Carelytic history",
      description:
        "Your account keeps track of every report you upload and the AI insights generated for you. Sign in or create an account to continue.",
      login: "Log in",
      createAccount: "Create account",
    },
    header: {
      badge: "Carelytic account",
      greeting: "Welcome back, {{name}}",
      greetingFallback: "Carelytic member",
      description:
        "Manage your profile, view past AI interpretations, and keep track of your credits and subscriptions.",
      phone: "Phone",
      email: "Email",
      emailPlaceholder: "Add an email to receive updates",
      plan: "Current plan",
      creditsAvailable: "Credits available: {{credits}}",
      uploadCta: "Upload new report",
      logout: "Log out",
    },
    reports: {
      heading: "Recent medical reports",
      count: {
        single: "{{count}} report",
        plural: "{{count}} reports",
      },
      empty:
        "Upload your first report to begin building your Carelytic history.",
      alerts: "{{count}} alerts",
      download: "Download summary",
      share: "Share with doctor",
    },
    health: {
      badge: "Health profile",
      heading: "Key medical details",
      description:
        "Carelytic tailors insights using your baseline health information. Update these details whenever something changes.",
      updateButton: "Update health profile (coming soon)",
      bloodGroup: "Blood group",
      diabetes: "Diabetes",
      hypertension: "High blood pressure",
      bool: {
        yes: "Yes",
        no: "No",
      },
      notProvided: "Not provided",
      note: "Want to add more conditions or medications? A detailed health profile editor is on the way.",
    },
    subscriptions: {
      badge: "Subscriptions",
      heading: "Unlock more value with credits",
      description:
        "Pay-as-you-go costs BDT 10 per report. Monthly and yearly subscriptions add bonus credits and a guaranteed 20% savings. Every unlocked report uses 10 credits.",
      renewNote:
        "Subscriptions renew automatically. Cancel anytime to switch back to pay-as-you-go pricing.",
      currentPlan: "Current plan",
      choosePlan: "Choose plan",
      includes: "Includes {{credits}} credits",
      includesNone: "no prepaid credits",
    },
  },
  login: {
    badge: "Secure login",
    heading: "Welcome back to Carelytic",
    intro:
      "Sign in with the Bangladeshi mobile number linked to your Carelytic account. You can receive a one-time passcode (OTP) or use the password you set during signup.",
    phone: {
      label: "Bangladeshi phone number",
      placeholder: "17XXXXXXX",
      errorInvalid:
        "Enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX).",
      send: "Send OTP",
      sending: "Sending code...",
      cta: "New to Carelytic?",
      createLink: "Create an account",
    },
    otp: {
      heading: "OTP sent to:",
      resendInfo:
        "Didn’t get it? You can request a new code in {{seconds}} seconds.",
      label: "Enter 6-digit code",
      edit: "Edit number",
      verify: "Verify & continue",
      verifying: "Verifying...",
      resendCta: "Still no code?",
      resend: "Resend OTP",
      errorCode: "Enter the six-digit code sent to your phone.",
      errorResend: "Resend the OTP to continue.",
    },
    methods: {
      label: "Choose your sign-in method",
      otp: "OTP login",
      password: "Password login",
    },
    password: {
      heading: "Use your password",
      label: "Password",
      placeholder: "Enter your password",
      errorRequired: "Enter your password to continue.",
      errorGeneric: "We couldn’t sign you in. Check your password or switch to OTP.",
      submit: "Sign in",
      submitting: "Signing in...",
      useOtp: "Prefer a one-time code?",
    },
    sidebar: {
      title: "Carelytic secure access",
      headline: "Clinical-grade insight with patient-first security",
      paragraph: "Your reports and health interpretations stay encrypted and compliant with Bangladeshi health data standards. Every session uses OTP verification for peace of mind.",
      otp: "Why OTP?",
      otpText: "2-step verification keeps your Carelytic insights private and ensures only you can access your medical history."
    },
  },
  signup: {
    badge: "Create your Carelytic profile",
    heading: "Your AI health companion starts here",
    intro:
      "Use your Bangladeshi mobile number to get started. We’ll verify it with an OTP and collect a few details to personalize your insights.",
    progress: "Progress",
    phone: {
      label: "Bangladeshi phone number",
      placeholder: "19XXXXXXX",
      errorInvalid:
        "Enter a valid Bangladeshi phone number (e.g. 018XXXXXXXX).",
      send: "Send OTP",
      sending: "Sending code...",
      cta: "Already have a Carelytic account?",
      loginLink: "Log in",
    },
    otp: {
      heading: "OTP sent to:",
      resendInfo: "Request a fresh code in {{seconds}} seconds.",
      label: "Enter 6-digit code",
      edit: "Edit number",
      verify: "Verify & continue",
      verifying: "Verifying...",
      resendCta: "Still waiting?",
      resend: "Resend OTP",
      errorCode: "Enter the six-digit code sent to your phone.",
    },
    details: {
      fullName: {
        label: "Full name",
        placeholder: "e.g. Ayesha Rahman",
        error:
          "Enter your full name so clinicians know who the report belongs to.",
      },
      email: {
        label: "Email (optional)",
        placeholder: "you@example.com",
        error: "Enter a valid email address or leave it blank.",
      },
      bloodGroup: {
        label: "Blood group",
        placeholder: "Select blood group",
        error: "Select your blood group so we can personalise your summaries.",
      },
      password: {
        label: "Create password",
        placeholder: "At least 6 characters",
        helper: "Use this password for quick logins without waiting for an OTP.",
        confirmLabel: "Confirm password",
        confirmPlaceholder: "Re-enter password",
        errorLength: "Password must be at least 6 characters long.",
        errorMismatch: "Passwords do not match.",
      },
      diabetic: {
        label: "Diabetes",
        yes: "Yes",
        no: "No",
      },
      hypertension: {
        label: "High blood pressure",
        yes: "Yes",
        no: "No",
      },
      conditionsError:
        "Let us know if you have diabetes or high blood pressure. You can update these later.",
      healthNote:
        "You can add or update more health details anytime from your account.",
      consent: {
        text: "I agree to Carelytic's [terms]Terms of Service[/terms] and [privacy]Privacy Policy[/privacy] and confirm that I am the owner of this phone number.",
        error: "We need your consent to create your Carelytic account.",
      },
      verifyPhoneError:
        "Please verify your phone number again to finish signing up.",
    },
    buttons: {
      back: "Back",
      create: "Create account",
      creating: "Creating...",
    },
    sidebar: {
      badge: "Carelytic onboarding",
      heading: "Designed for patients, trusted by clinicians",
      body: "We verify every account with mobile OTP to ensure your medical insights stay protected and compliant with Bangladeshi data standards.",
      featuresTitle: "What you get",
      features: [
        "Instant AI summaries of lab and imaging reports",
        "Trends and alerts tailored to Bangladeshi clinical ranges",
        "Shareable insights for your doctor or care circle",
      ],
    },
  },
  report: {
    statuses: {
      normal: "Normal",
      attention: "Attention",
    },
    actions: {
      viewDetails: "View report details",
      backToSummary: "Back to report summary",
    },
    sample: {
      title: "Complete Blood Count",
      subtitle: "CBC snapshot interpreted by Carelytic",
      summary: {
        intro: "Here’s what stood out in your results:",
        bullets: [
          "White blood cell count is mildly elevated (11.2 k/µL), suggesting your immune system is responding to stress or a low-grade infection.",
          "Fasting glucose sits at 104 mg/dL, a pre-diabetic range. Consistent readings like this can signal emerging insulin resistance.",
          "Hemoglobin and platelet counts remain comfortably within range, supporting healthy oxygen delivery and clotting.",
        ],
        recommendation:
          "Share this summary with your clinician and note any symptoms like fever, fatigue, or unusual thirst over the next few days.",
      },
      metrics: {
        hemoglobin: {
          label: "Hemoglobin",
          insight: "Healthy red blood cell levels.",
          detail: {
            explanation:
              "Hemoglobin carries oxygen from your lungs to the rest of the body. Values between 12.0 and 16.0 g/dL are typical for adults.",
            meaning:
              "Your reading of 13.5 g/dL is squarely within range, signalling strong oxygen-carrying capacity.",
            guidance:
              "Maintain balanced meals with iron-rich foods such as leafy greens, beans, or lean meats to keep levels steady.",
          },
        },
        wbc: {
          label: "White blood cells",
          insight:
            "Slight elevation — review for potential infection or stress.",
          detail: {
            explanation:
              "White blood cells defend against infections. Labs usually expect 4.0 to 10.0 k/µL in adults.",
            meaning:
              "At 11.2 k/µL your immune system is likely responding to inflammation, recent illness, or even a stressful week.",
            guidance:
              "Track symptoms such as fever or sore throat. If levels stay high for several weeks, schedule a follow-up CBC.",
          },
        },
        platelets: {
          label: "Platelets",
          insight: "Platelet count within expected range.",
          detail: {
            explanation:
              "Platelets help blood clot and prevent excessive bleeding. A normal range is 150–400 k/µL.",
            meaning:
              "Your result of 295 k/µL supports healthy clotting with no active concerns.",
            guidance:
              "Stay hydrated and keep up regular activity—both support optimal platelet function.",
          },
        },
        glucose: {
          label: "Glucose (Fasting)",
          insight: "Borderline high — consider lifestyle adjustments.",
          detail: {
            explanation:
              "Fasting glucose reflects how efficiently your body manages blood sugar after an overnight fast. Healthy targets are 70–99 mg/dL.",
            meaning:
              "At 104 mg/dL, you’re slightly above target. Persistent readings above 100 mg/dL can foreshadow pre-diabetes.",
            guidance:
              "Focus on consistent sleep, balanced meals, and 150 minutes of weekly movement. Recheck fasting glucose in 3 months.",
          },
        },
      },
      nextSteps: [
        {
          title: "Support immune recovery",
          description:
            "Prioritise rest, hydration, and nutrient-dense meals while your white blood cells settle.",
        },
        {
          title: "Track fasting routines",
          description:
            "Note bedtime snacks, stress levels, and morning glucose readings to spot patterns affecting blood sugar.",
        },
        {
          title: "Discuss follow-up tests",
          description:
            "Ask your clinician whether an HbA1c test or repeat CBC is appropriate if symptoms continue.",
        },
      ],
      footnote:
        "Carelytic summaries are informational. Always follow personalised advice from your healthcare professional.",
    },
  },
  uploadCard: {
    dropzone: {
      title: "Drag & drop your report",
      subtitle: "or browse files",
      helper: "PDF or image up to 10 MB. We keep files private and secure.",
      browse: "Browse files",
      dropLabel: "Drop it here",
    },
    processing: {
      title: "Analyzing your report...",
      subtitle:
        "Carelytic is extracting key metrics and comparing them with healthy ranges.",
    },
    complete: {
      title: "Insights ready",
      subtitle: "Carelytic found {{count}} items that may need a closer look.",
    },
    summary: {
      title: "Report summary",
      lockedNote:
        "Unlock to view AI insights. Cost: BDT {{cost}} / {{credits}} credits.",
      unlockTitle: "Unlock options",
      unlockDescription:
        "Pay-as-you-go price is <strong>BDT {{cost}}</strong>. Subscribers can redeem <strong>{{credits}} credits</strong> per report.",
      unlockWithCredits: "Unlock with credits ({{credits}})",
      notEnoughCredits:
        "You have {{credits}} credits. Buy a subscription to top up.",
      payTitle: "Pay BDT {{cost}}",
      balanceTitle: "Current balance",
      planLabel: "Plan:",
      loginPrompt: "Sign in to track credits and history.",
      addSubscription: "Try monthly subscription (adds 120)",
      viewDetails: "Read full interpretation",
      lockedOverlay: "Unlock to explore each metric and personalised guidance.",
      topUpSuccess: "Added {{amount}} credits to your balance.",
    },
    results: {
      title: "Key metrics",
      statusLabel: "Status",
      referenceRange: "Reference range",
    },
    history: {
      alertsLabel: "{{count}} alerts",
    },
  },
} satisfies Translations;
