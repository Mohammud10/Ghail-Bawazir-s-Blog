import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Seed Admin User
  const adminEmail = 'admin@smartcalculators.com';
  const hashedPassword = await bcrypt.hash('Admin123!', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      name: 'Admin Manager',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user seeded.');

  // 2. Seed Site Settings
  const settings = [
    { key: 'siteName', value: { en: 'Smart Calculators Hub', ar: 'مركز الحاسبات الذكية' }, group: 'general' },
    { key: 'siteDescription', value: { en: 'Free professional tools and calculators', ar: 'أدوات وحاسبات احترافية مجانية' }, group: 'general' },
    { key: 'adsenseEnabled', value: { enabled: false }, group: 'ads' },
    { key: 'adsenseClientId', value: { id: '' }, group: 'ads' },
    { key: 'gaId', value: { id: '' }, group: 'analytics' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, group: setting.group },
      create: { key: setting.key, value: setting.value, group: setting.group },
    });
  }
  console.log('Site settings seeded.');

  // 3. Seed Ad Slots
  const adSlots = [
    { name: 'header', position: 'Header Slot', format: 'responsive' },
    { name: 'between-sections', position: 'Between Sections', format: 'responsive' },
    { name: 'before-calculator', position: 'Before Calculator Form', format: 'responsive' },
    { name: 'after-result', position: 'After Result Card', format: 'responsive' },
    { name: 'in-content', position: 'In-Content Explanation', format: 'responsive' },
    { name: 'sidebar', position: 'Sidebar Desktop Slot', format: 'rectangle' },
    { name: 'footer', position: 'Footer Slot', format: 'responsive' },
  ];

  for (const slot of adSlots) {
    await prisma.adSlot.upsert({
      where: { name: slot.name },
      update: { position: slot.position, format: slot.format },
      create: { name: slot.name, position: slot.position, format: slot.format },
    });
  }
  console.log('Ad slots seeded.');

  // 4. Seed Categories
  const categories = [
    {
      slug: 'financial',
      name: { en: 'Financial Calculators', ar: 'حاسبات مالية' },
      description: { en: 'Calculate loans, investments, taxes, and monthly budgets', ar: 'احسب القروض والاستثمارات والضرائب والميزانيات الشهرية' },
      icon: 'Landmark',
      sortOrder: 1,
    },
    {
      slug: 'health',
      name: { en: 'Health Calculators', ar: 'حاسبات صحية' },
      description: { en: 'Track BMI, calorie intake, ideal weight, and body water needs', ar: 'تتبع مؤشر كتلة الجسم، السعرات الحرارية، الوزن المثالي، واحتياجات المياه' },
      icon: 'HeartPulse',
      sortOrder: 2,
    },
    {
      slug: 'math',
      name: { en: 'Math Calculators', ar: 'حاسبات رياضيات' },
      description: { en: 'Solve percentages, geometry areas, volume, and equations', ar: 'حل النسب المئوية، مساحات الأشكال الهندسية، الحجوم والمعادلات' },
      icon: 'Percent',
      sortOrder: 3,
    },
    {
      slug: 'converters',
      name: { en: 'Unit Converters', ar: 'محولات الوحدات' },
      description: { en: 'Convert lengths, weights, temperatures, and speeds', ar: 'حول الأطوال، الأوزان، درجات الحرارة والسرعات' },
      icon: 'ArrowLeftRight',
      sortOrder: 4,
    },
    {
      slug: 'tech',
      name: { en: 'Technology Tools', ar: 'أدوات تقنية' },
      description: { en: 'Check password strength, internet download speeds, and subnetting', ar: 'افحص قوة كلمة المرور، سرعة تحميل الملفات وتفاصيل الشبكات Subnetting' },
      icon: 'Cpu',
      sortOrder: 5,
    },
  ];

  const categoryMap: Record<string, string> = {};

  for (const cat of categories) {
    const dbCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
      },
    });
    categoryMap[cat.slug] = dbCat.id;
  }
  console.log('Categories seeded.');

  // 5. Seed Calculators
  const calculators = [
    {
      slug: 'loan-calculator',
      categorySlug: 'financial',
      name: { en: 'Loan Calculator', ar: 'حاسبة القروض' },
      description: { en: 'Calculate monthly payments and total interest for a loan', ar: 'احسب القسط الشهري للقرض وإجمالي الفوائد المترتبة' },
      content: {
        en: 'Use this loan calculator to compute monthly payments and build an amortization schedule. Helps evaluate mortgage, auto, or personal loans.',
        ar: 'استخدم حاسبة القروض هذه لحساب الأقساط الشهرية وبناء جدول سداد. تساعد في تقييم القروض العقارية، قروض السيارات، أو القروض الشخصية.',
      },
      formulaExplanation: {
        en: 'The monthly payment is calculated using the standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1] where P is principal, r is monthly interest rate, and n is total months.',
        ar: 'يتم حساب القسط الشهري باستخدام صيغة الإهلاك القياسية: القسط = المبلغ * [الفائدة*(1+الفائدة)^الشهور] / [(1+الفائدة)^الشهور - 1] حيث تمثل الفائدة المعدل الشهري.',
      },
      example: {
        en: 'For a loan of $10,000 at a 5% annual interest rate for 36 months, the monthly payment will be $299.71, with a total interest of $789.53.',
        ar: 'لقرض بقيمة 10,000$ بمعدل فائدة سنوي 5% لمدة 36 شهراً، سيكون القسط الشهري 299.71$ وإجمالي الفائدة 789.53$.',
      },
      metaTitle: { en: 'Loan Calculator - Monthly Amortization Payment', ar: 'حاسبة القروض - حساب القسط الشهري وسداد القرض' },
      metaDescription: { en: 'Free online loan calculator to estimate monthly payments, total interest costs, and schedule.', ar: 'حاسبة قروض مجانية لتقدير الأقساط الشهرية، إجمالي الفوائد وجداول السداد للقروض.' },
      keywords: { en: ['loan', 'mortgage', 'calculator', 'amortization'], ar: ['قرض', 'تمويل', 'حاسبة', 'أقساط'] },
      icon: 'Landmark',
      calculatorType: 'loan',
      sortOrder: 1,
      isFeatured: true,
      faqs: [
        {
          question: { en: 'What is amortization?', ar: 'ما هو إهلاك القرض (Amortization)؟' },
          answer: { en: 'Amortization is the process of spreading out a loan into periodic equal payments over time.', ar: 'إهلاك القرض هو عملية توزيع سداد القرض على دفعات دورية متساوية عبر الزمن.' },
        },
        {
          question: { en: 'Can I pay off my loan early?', ar: 'هل يمكنني سداد القرض مبكراً؟' },
          answer: { en: 'Most lenders allow early payoff, but some may charge prepayment penalties. Check your agreement details.', ar: 'تسمح معظم الجهات بالسداد المبكر، ولكن قد يفرض البعض رسوم سداد مبكر. تحقق من تفاصيل عقدك.' },
        },
      ],
    },
    {
      slug: 'bmi-calculator',
      categorySlug: 'health',
      name: { en: 'BMI Calculator', ar: 'حاسبة مؤشر كتلة الجسم' },
      description: { en: 'Calculate Body Mass Index (BMI) to check healthy weight status', ar: 'احسب مؤشر كتلة الجسم لتحديد ما إذا كان وزنك صحياً ومتناسباً مع طولك' },
      content: {
        en: 'This BMI calculator uses height and weight to assess whether you are underweight, normal, overweight, or obese. It is a quick screening tool for adult health status.',
        ar: 'تستخدم حاسبة مؤشر كتلة الجسم الطول والوزن لتحديد ما إذا كان وزنك ناقصاً، طبيعياً، زائداً، أو تعاني من السمنة. إنها أداة فحص سريعة للبالغين.',
      },
      formulaExplanation: {
        en: 'BMI is calculated by dividing your weight in kilograms by your height in meters squared: BMI = weight(kg) / height(m)²',
        ar: 'يتم حساب مؤشر كتلة الجسم بقسمة الوزن بالكيلوغرام على مربع الطول بالمتر: المؤشر = الوزن (كجم) / الطول(م)²',
      },
      example: {
        en: 'For an adult with weight of 70kg and height of 175cm: BMI = 70 / (1.75)² = 22.86, which falls in the normal healthy weight range.',
        ar: 'لشخص يزن 70 كجم وطوله 175 سم: مؤشر كتلة الجسم = 70 / (1.75)² = 22.86، وهو يقع ضمن النطاق الطبيعي والصحي.',
      },
      metaTitle: { en: 'BMI Calculator - Free Body Mass Index Check', ar: 'حاسبة مؤشر كتلة الجسم BMI | حساب الوزن المثالي' },
      metaDescription: { en: 'Find your Body Mass Index (BMI) instantly. Free health checker for height and weight ratio.', ar: 'اعرف مؤشر كتلة جسمك فوراً. حاسبة صحية مجانية لتقييم تناسب الوزن والطول ومعرفة الوزن المثالي.' },
      keywords: { en: ['bmi', 'health', 'weight', 'height', 'fitness'], ar: ['مؤشر كتلة الجسم', 'وزن', 'طول', 'صحة', 'سمنة'] },
      icon: 'HeartPulse',
      calculatorType: 'bmi',
      sortOrder: 1,
      isFeatured: true,
      faqs: [
        {
          question: { en: 'Is BMI accurate for bodybuilders?', ar: 'هل مؤشر كتلة الجسم دقيق للاعبي كمال الأجسام؟' },
          answer: { en: 'No, BMI does not distinguish between muscle and fat. Muscle is denser than fat, so bodybuilders might get a high BMI score representing overweight/obesity.', ar: 'لا، فالمؤشر لا يميز بين العضلات والدهون. وبما أن العضلات أكثر كثافة، قد يظهر المؤشر للاعبي كمال الأجسام على أنه سمنة.' },
        },
      ],
    },
    {
      slug: 'percentage-calculator',
      categorySlug: 'math',
      name: { en: 'Percentage Calculator', ar: 'حاسبة النسبة المئوية' },
      description: { en: 'Calculate percentage values, percentage changes, and fractions', ar: 'احسب النسب المئوية، الزيادة أو النقصان المئوي، والقيم الكسرية' },
      content: {
        en: 'Use this tool to calculate percentages of numbers, find what percentage one number is of another, or calculate percentage increases and decreases.',
        ar: 'استخدم هذه الأداة لحساب النسبة المئوية من الأرقام، ومعرفة نسبة رقم إلى رقم آخر، أو حساب نسب الزيادة والنقصان.',
      },
      formulaExplanation: {
        en: 'Percentage = (Value / Total Value) * 100. Percentage change = ((New Value - Old Value) / |Old Value|) * 100.',
        ar: 'النسبة المئوية = (الجزء / الكل) * 100. التغير المئوي = ((القيمة الجديدة - القيمة القديمة) / القيمة القديمة المطلقة) * 100.',
      },
      example: {
        en: 'To find 20% of 150: (20 / 100) * 150 = 30. A change from 100 to 120 is a 20% increase.',
        ar: 'لإيجاد 20% من 150: (20 / 100) * 150 = 30. التغير من 100 إلى 120 يمثل زيادة بنسبة 20%.',
      },
      metaTitle: { en: 'Percentage Calculator - Find Percentage Values', ar: 'حاسبة النسبة المئوية المباشرة والسهلة' },
      metaDescription: { en: 'Easily calculate percentages, increases, decreases, and percentage changes online.', ar: 'احسب النسب المئوية والزيادة والنقصان والتغير المئوي بسهولة بالغة وبشكل فوري.' },
      keywords: { en: ['percentage', 'math', 'math calculator', 'discount', 'percent'], ar: ['نسبة مئوية', 'حاسبة نسب', 'رياضيات', 'حساب النسبة'] },
      icon: 'Percent',
      calculatorType: 'percentage',
      sortOrder: 1,
      isFeatured: true,
      faqs: [
        {
          question: { en: 'How do you calculate a 15% tip?', ar: 'كيف تحسب بقشيشاً بنسبة 15%؟' },
          answer: { en: 'Multiply the bill amount by 0.15. For example, a $50 bill * 0.15 = $7.50 tip.', ar: 'اضرب إجمالي الفاتورة في 0.15. مثلاً فاتورة بقيمة 50$ * 0.15 = 7.50$ بقشيش.' },
        },
      ],
    },
    {
      slug: 'length-converter',
      categorySlug: 'converters',
      name: { en: 'Length Converter', ar: 'محول الطول' },
      description: { en: 'Convert between meter, kilometer, centimeter, inch, foot, and mile', ar: 'حول الأطوال بين الأمتار، الكيلومترات، السنتيمترات، البوصات، الأقدام والأميال' },
      content: {
        en: 'This tool converts lengths and distances instantly. Supports metric units like meters and kilometers alongside imperial units like inches and miles.',
        ar: 'تقوم هذه الأداة بتحويل الأطوال والمسافات بشكل فوري. تدعم الوحدات المترية (متر، كيلومتر) والوحدات الإمبراطورية (أقدام، بوصات، أميال).',
      },
      formulaExplanation: {
        en: 'Conversions use fixed mathematical ratios. For example, 1 inch = 2.54 centimeters, and 1 foot = 0.3048 meters.',
        ar: 'تستخدم التحويلات نسباً رياضية ثابتة. على سبيل المثال، البوصة الواحدة تساوي 2.54 سنتيمتر، والقدم الواحد يساوي 0.3048 متر.',
      },
      example: {
        en: 'Converting 5 feet to meters: 5 * 0.3048 = 1.524 meters.',
        ar: 'تحويل 5 أقدام إلى أمتار: 5 * 0.3048 = 1.524 متر.',
      },
      metaTitle: { en: 'Length and Distance Converter - Units conversion', ar: 'محول الأطوال والمسافات - تحويل الوحدات' },
      metaDescription: { en: 'Convert meters, feet, inches, kilometers, miles, and yards. Easy conversions.', ar: 'حول الأمتار، الأقدام، البوصات، الكيلومترات، الأميال والياردات بشكل سهل ومباشر.' },
      keywords: { en: ['length', 'distance', 'converter', 'metric', 'imperial'], ar: ['تحويل طول', 'مسافة', 'متر', 'قدم', 'بوصة', 'تحويل وحدات'] },
      icon: 'ArrowLeftRight',
      calculatorType: 'length',
      sortOrder: 1,
      isFeatured: true,
      faqs: [
        {
          question: { en: 'How many inches in a foot?', ar: 'كم بوصة في القدم الواحد؟' },
          answer: { en: 'There are exactly 12 inches in 1 foot.', ar: 'يحتوي القدم الواحد على 12 بوصة بالضبط.' },
        },
      ],
    },
    {
      slug: 'password-strength',
      categorySlug: 'tech',
      name: { en: 'Password Strength Checker', ar: 'فاحص قوة كلمة المرور' },
      description: { en: 'Check password security and robustness against brute force', ar: 'افحص مدى أمان كلمة المرور وقوتها ضد الاختراق والتخمين' },
      content: {
        en: 'A security tool to analyze password complexity. Checks lengths, casing, digits, and special characters to determine entropy and safety.',
        ar: 'أداة أمان لتحليل مدى تعقيد كلمة المرور. تفحص الطول، الأحرف الكبيرة والصغيرة، الأرقام، والرموز الخاصة لتحديد مدى الأمان.',
      },
      formulaExplanation: {
        en: 'Scores passwords on a scale of 0 to 6 based on requirements met: length, capitalization, lower casing, numbers, and special symbols.',
        ar: 'تقيم الأداة كلمات المرور من 0 إلى 6 بناءً على المتطلبات المستوفاة: الطول، الأحرف الكبيرة والصغيرة، الأرقام، والرموز الخاصة.',
      },
      example: {
        en: 'A password like "p@ss1" is classified as Weak. "P@ssw0rd2026!" meets all rules and is classified as Strong.',
        ar: 'كلمة مرور مثل "p@ss1" تصنف على أنها ضعيفة. بينما "P@ssw0rd2026!" تستوفي كل الشروط وتصنف كقوية جداً.',
      },
      metaTitle: { en: 'Password Strength Checker - Test Security', ar: 'فاحص قوة كلمة المرور - اختبار مدى الأمان' },
      metaDescription: { en: 'Analyze password strength online. Get tips to build secure, robust passwords.', ar: 'حلل قوة كلمة مرورك واعرف مدى أمانها مع نصائح لبناء كلمة مرور قوية وغير قابلة للتخمين.' },
      keywords: { en: ['password', 'security', 'strength', 'brute force', 'entropy'], ar: ['كلمة مرور', 'أمان', 'قوة كلمة المرور', 'اختراق', 'حماية'] },
      icon: 'Cpu',
      calculatorType: 'password-strength',
      sortOrder: 1,
      isFeatured: true,
      faqs: [
        {
          question: { en: 'What makes a password strong?', ar: 'ما الذي يجعل كلمة المرور قوية؟' },
          answer: { en: 'A strong password is at least 12 characters long and contains a mix of uppercase, lowercase, numbers, and special characters.', ar: 'تكون كلمة المرور قوية عندما لا تقل عن 12 حرفاً وتحتوي على مزيج من الأحرف الكبيرة والصغيرة والأرقام والرموز الخاصة.' },
        },
      ],
    },
    {
      slug: 'simple-interest',
      categorySlug: 'financial',
      name: { en: 'Simple Interest Calculator', ar: 'حاسبة الفائدة البسيطة' },
      description: { en: 'Calculate simple interest values and total interest accrued', ar: 'احسب قيمة الفائدة البسيطة وإجمالي المستحقات المالية التراكمية' },
      content: {
        en: 'Simple interest is a quick method of calculating the interest charge on a loan or investment.',
        ar: 'الفائدة البسيطة هي طريقة سريعة وسهلة لحساب رسوم الفائدة المفروضة على قرض أو استثمار مالي.',
      },
      formulaExplanation: {
        en: 'Interest = Principal * Rate * Time. Total = Principal + Interest.',
        ar: 'الفائدة = رأس المال * معدل الفائدة * المدة الزمنية. إجمالي المبلغ = رأس المال + الفائدة.',
      },
      example: {
        en: 'For a principal of $5,000 at a 6.5% interest rate for 5 years, Simple Interest is $1,625.',
        ar: 'لرأس مال بقيمة 5,000$ بمعدل فائدة 6.5% لمدة 5 سنوات، ستكون الفائدة البسيطة 1,625$.',
      },
      metaTitle: { en: 'Simple Interest Calculator - Accumulation', ar: 'حاسبة الفائدة البسيطة - الفوائد المالية' },
      metaDescription: { en: 'Free online simple interest calculator to quickly determine loan or investment returns.', ar: 'حاسبة فائدة بسيطة مجانية أونلاين لتقدير أرباح الاستثمار أو تكاليف القروض بسهولة.' },
      keywords: { en: ['simple interest', 'financial', 'interest', 'investment'], ar: ['فائدة بسيطة', 'حساب الفائدة', 'استثمار', 'قروض'] },
      icon: 'Percent',
      calculatorType: 'simple-interest',
      sortOrder: 2,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'compound-interest',
      categorySlug: 'financial',
      name: { en: 'Compound Interest Calculator', ar: 'حاسبة الفائدة المركبة' },
      description: { en: 'Calculate compound interest growth over time', ar: 'احسب الفائدة المركبة وأثر تراكم الأرباح مع الزمن' },
      content: {
        en: 'Find out how much your investment can grow with compounding interest frequencies (monthly, quarterly, or annually).',
        ar: 'اكتشف كم يمكن أن ينمو استثمارك المالي مع تطبيق الفائدة المركبة بفتراتها المختلفة (شهرياً، ربع سنوي، أو سنوياً).',
      },
      formulaExplanation: {
        en: 'A = P(1 + r/n)^(nt) where P is principal, r is rate, t is time, and n is compounding frequency.',
        ar: 'الرصيد النهائي = رأس المال * (1 + الفائدة/الفترات)^(الفترات * السنوات).',
      },
      example: {
        en: 'For $5,000 at 6.5% interest compounded monthly for 5 years, the total balance will be $6,916.38.',
        ar: 'لمبلغ 5,000$ بمعدل فائدة 6.5% مركب شهرياً لمدة 5 سنوات، سيكون الرصيد الإجمالي النهائي 6,916.38$.',
      },
      metaTitle: { en: 'Compound Interest Calculator - Growth Tool', ar: 'حاسبة الفائدة المركبة - نمو الاستثمار' },
      metaDescription: { en: 'Determine compound interest growth. Easy calculations with customizable compounding periods.', ar: 'احسب نمو أرباحك بالفائدة المركبة مع دعم فترات تركيب متعددة شهرياً وسنوياً.' },
      keywords: { en: ['compound interest', 'growth', 'finance', 'savings'], ar: ['فائدة مركبة', 'نمو رأس المال', 'ادخار', 'أرباح مركبة'] },
      icon: 'TrendingUp',
      calculatorType: 'compound-interest',
      sortOrder: 3,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'daily-calories',
      categorySlug: 'health',
      name: { en: 'Daily Calorie Needs', ar: 'حاسبة السعرات الحرارية' },
      description: { en: 'Find daily maintenance calories based on your activity', ar: 'احسب السعرات الحرارية اليومية اللازمة لتثبيت الوزن أو إنقاصه' },
      content: {
        en: 'Calculate your BMR and daily calorie maintenance needs based on your personal metrics and active exercises.',
        ar: 'احسب معدل الأيض الأساسي BMR والسعرات الحرارية اليومية المطلوبة لتثبيت الوزن بناءً على قياساتك ومستوى نشاطك.',
      },
      formulaExplanation: {
        en: 'Uses Harris-Benedict BMR equation multiplied by activity multiplier.',
        ar: 'تستخدم معادلة Harris-Benedict لحساب معدل الأيض مضروباً في معامل المجهود البدني.',
      },
      example: {
        en: 'For a 70kg, 175cm, 25yo male, BMR is 1678. Sedentary maintenance is 2014 kcal.',
        ar: 'لذكر عمره 25 عاماً بوزن 70 كجم وطول 175 سم: BMR هو 1,678 سعرة، والاحتياج لتثبيت الوزن عند الخمول هو 2,014 سعرة.',
      },
      metaTitle: { en: 'Daily Calorie Calculator - Maintenance kcal', ar: 'حاسبة السعرات الحرارية اليومية لتثبيت الوزن' },
      metaDescription: { en: 'Calculate daily calories to lose, gain, or maintain weight. Quick BMR estimator.', ar: 'احسب السعرات الحرارية اليومية المناسبة لإنقاص الوزن، زيادة الوزن، أو المحافظة عليه.' },
      keywords: { en: ['calories', 'calories calculator', 'bmr', 'diet', 'fitness'], ar: ['سعرات حرارية', 'حرق دهون', 'رجيم', 'تغذية', 'صحة'] },
      icon: 'Flame',
      calculatorType: 'daily-calories',
      sortOrder: 2,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'ideal-weight',
      categorySlug: 'health',
      name: { en: 'Ideal Weight Calculator', ar: 'حاسبة الوزن المثالي' },
      description: { en: 'Estimate healthy body weight based on height', ar: 'احسب الوزن المثالي المتناسق لجسدك بناءً على طولك ونوعك الاجتماعي' },
      content: {
        en: 'Find your target healthy ideal weight range using standard scientific formulas.',
        ar: 'اعرف مدى الوزن المثالي الصحي والأنسب لجسدك بناءً على معادلات الوزن العالمية.',
      },
      formulaExplanation: {
        en: 'Uses the Devine Formula based on height and gender.',
        ar: 'تعتمد الحاسبة على صيغة Devine لتقدير الوزن المناسب بعد الـ 60 بوصة الأساسية للطول.',
      },
      example: {
        en: 'A male with height 175 cm has an ideal weight of 70.5 kg.',
        ar: 'رجل طوله 175 سم (68.9 بوصة) يكون وزنه المثالي المقدر 70.5 كجم.',
      },
      metaTitle: { en: 'Ideal Weight Calculator - Devine Formula', ar: 'حاسبة الوزن المثالي الصحي - تقدير الوزن' },
      metaDescription: { en: 'Find your ideal body weight easily. Height to weight healthy ratio checks.', ar: 'احسب وزنك المثالي المستهدف أونلاين. تقديرات صحية سريعة لنسبة الطول والوزن.' },
      keywords: { en: ['ideal weight', 'healthy weight', 'height weight', 'fitness'], ar: ['وزن مثالي', 'وزن صحي', 'تناسق الطول والوزن', 'رشاقة'] },
      icon: 'Activity',
      calculatorType: 'ideal-weight',
      sortOrder: 3,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'area-calculator',
      categorySlug: 'math',
      name: { en: 'Area Calculator', ar: 'حاسبة المساحات' },
      description: { en: 'Calculate the area of a square, rectangle, or circle', ar: 'احسب مساحة المربع، المستطيل، أو الدائرة الهندسية بسهولة' },
      content: {
        en: 'Quickly find the surface area for basic geometric shapes with our free tool.',
        ar: 'احسب مساحات الأشكال الهندسية الأساسية (مربع، مستطيل، دائرة) بسهولة وسرعة.',
      },
      formulaExplanation: {
        en: 'Square: s², Rectangle: l * w, Circle: π * r².',
        ar: 'المربع: الضلع²، المستطيل: الطول * العرض، الدائرة: ط * نق².',
      },
      example: {
        en: 'For a rectangle with length 5 and width 8, area is 40.',
        ar: 'لمستطيل طوله 5 وعرضه 8: المساحة = 5 * 8 = 40 وحدة مربعة.',
      },
      metaTitle: { en: 'Area Calculator - Square, Rectangle, Circle', ar: 'حاسبة مساحة الأشكال الهندسية المختلفة' },
      metaDescription: { en: 'Free online area calculator. Find the surface area of primary shapes.', ar: 'احسب مساحة المربع والمستطيل والدائرة أونلاين بسهولة بالغة مع القوانين.' },
      keywords: { en: ['area', 'geometry', 'square area', 'circle area'], ar: ['مساحة', 'هندسة رياضية', 'مساحة الدائرة', 'مساحة المستطيل'] },
      icon: 'Square',
      calculatorType: 'area',
      sortOrder: 2,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'volume-calculator',
      categorySlug: 'math',
      name: { en: 'Volume Calculator', ar: 'حاسبة الحجوم' },
      description: { en: 'Calculate the volume of a cube, cylinder, or sphere', ar: 'احسب حجم المكعب، الأسطوانة، أو الكرة الهندسية' },
      content: {
        en: 'Calculate the three-dimensional space occupancy for cubes, cylinders, and spheres.',
        ar: 'احسب السعة الحجمية للمجسمات ثلاثية الأبعاد (مكعب، أسطوانة، كرة) في ثوانٍ.',
      },
      formulaExplanation: {
        en: 'Cube: s³, Cylinder: π * r² * h, Sphere: (4/3) * π * r³.',
        ar: 'المكعب: الضلع³، الأسطوانة: ط * نق² * الارتفاع، الكرة: (4/3) * ط * نق³.',
      },
      example: {
        en: 'For a cylinder with radius 5 and height 10, volume is 785.4.',
        ar: 'لأسطوانة نصف قطرها 5 وارتفاعها 10: الحجم = ط * 5² * 10 = 785.4 وحدة مكعبة.',
      },
      metaTitle: { en: 'Volume Calculator - Cube, Cylinder, Sphere', ar: 'حاسبة حجم المجسمات والأشكال ثلاثية الأبعاد' },
      metaDescription: { en: 'Calculate volumes of spheres, cylinders, and cubes. Easy geometry tool.', ar: 'احسب حجم المكعب والكرة والأسطوانة أونلاين بشكل سريع ودقيق بالكامل.' },
      keywords: { en: ['volume', 'cylinder volume', 'sphere volume', 'cube'], ar: ['حجم الأسطوانة', 'حجم الكرة', 'حساب حجم', 'مجسمات'] },
      icon: 'Box',
      calculatorType: 'volume',
      sortOrder: 3,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'weight-converter',
      categorySlug: 'converters',
      name: { en: 'Weight Converter', ar: 'محول الأوزان' },
      description: { en: 'Convert weights between kg, lbs, g, and oz', ar: 'حول الأوزان والكتل بين الكيلوغرام، الرطل، الغرام، والأونصة' },
      content: {
        en: 'Convert weight units instantly between metric and imperial systems.',
        ar: 'حول الأوزان والكتل بشكل فوري وسهل بين مقاييس القياس المترية والإمبراطورية.',
      },
      formulaExplanation: {
        en: 'Converts input into kilograms standard first, then scales to target unit.',
        ar: 'يتم تحويل المدخل إلى وحدة الكيلوغرام أولاً كمعيار، ثم يتم التحويل للوحدة النهائية.',
      },
      example: {
        en: 'To convert 10 lbs to kg: 10 * 0.45359 = 4.5359 kg.',
        ar: 'لتحويل 10 أرطال إلى كيلوغرامات: 10 * 0.45359 = 4.5359 كجم.',
      },
      metaTitle: { en: 'Weight Converter - Kilogram, Pound, Ounce', ar: 'محول الأوزان والكتل - تحويل الرطل والكيلو' },
      metaDescription: { en: 'Convert between kg, lbs, grams, and ounces easily with our free tool.', ar: 'محول أوزان مجاني للتحويل بين الكيلو والرطل والأونصة والغرام بدقة.' },
      keywords: { en: ['weight converter', 'lbs to kg', 'kg to lbs', 'grams to ounces'], ar: ['تحويل وزن', 'تحويل رطل', 'تحويل كيلو', 'تحويل كتل'] },
      icon: 'Weight',
      calculatorType: 'weight',
      sortOrder: 2,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'temperature-converter',
      categorySlug: 'converters',
      name: { en: 'Temperature Converter', ar: 'محول درجات الحرارة' },
      description: { en: 'Convert between Celsius, Fahrenheit, and Kelvin', ar: 'حول درجات الحرارة بين مقاييس سيلسيوس، فهرنهايت، وكلفن' },
      content: {
        en: 'Easily switch temperature degrees between standard thermal metrics.',
        ar: 'حول درجات الحرارة والبرودة بسهولة بين المقاييس الحرارية العالمية الثلاثة.',
      },
      formulaExplanation: {
        en: 'F = (C * 9/5) + 32. K = C + 273.15.',
        ar: 'فهرنهايت = (سيلسيوس * 9/5) + 32. كلفن = سيلسيوس + 273.15.',
      },
      example: {
        en: 'Converting 25°C to Fahrenheit: (25 * 9/5) + 32 = 77°F.',
        ar: 'تحويل 25 سيلسيوس إلى فهرنهايت: (25 * 9/5) + 32 = 77 فهرنهايت.',
      },
      metaTitle: { en: 'Temperature Converter - Celsius, Fahrenheit', ar: 'محول درجات الحرارة - سيلسيوس وفهرنهايت' },
      metaDescription: { en: 'Quick conversion tool for Celsius to Fahrenheit and Kelvin temperature scales.', ar: 'محول درجات حرارة مجاني وسريع للتحويل بين السيلسيوس، الفهرنهايت والكلفن.' },
      keywords: { en: ['temperature converter', 'celsius to fahrenheit', 'kelvin to celsius'], ar: ['تحويل درجات حرارة', 'سيلسيوس وفهرنهايت', 'كلفن'] },
      icon: 'Thermometer',
      calculatorType: 'temperature',
      sortOrder: 3,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'download-speed',
      categorySlug: 'tech',
      name: { en: 'Download Speed Calculator', ar: 'حاسبة سرعة التحميل' },
      description: { en: 'Estimate download times based on network speed', ar: 'احسب وقت تحميل الملفات والبيانات بناءً على سرعة الإنترنت' },
      content: {
        en: 'Determine how long a file will take to download over different bandwidth connections.',
        ar: 'احسب الوقت الفعلي لزمن تحميل أي ملف بناءً على سرعة باقة الإنترنت وسعة التنزيل.',
      },
      formulaExplanation: {
        en: 'Time = (File Size in GB * 8192) / Bandwidth in Mbps.',
        ar: 'الوقت بالثواني = (حجم الملف بالجيجابايت * 8192) / سرعة الإنترنت بالميجابت في الثانية.',
      },
      example: {
        en: 'A 5 GB file on a 100 Mbps line takes 6 mins 49 secs to download.',
        ar: 'ملف بحجم 5 جيجابايت وسرعة إنترنت 100 ميجابت يستغرق 6 دقائق و 49 ثانية.',
      },
      metaTitle: { en: 'Download Speed & Time Calculator - Estimator', ar: 'حاسبة وقت وسرعة تحميل الملفات والبيانات' },
      metaDescription: { en: 'Calculate download speeds and estimated time of arrivals for files.', ar: 'احسب سرعة التحميل للملفات وتفاصيل التنزيل عبر سرعات الاتصال المختلفة.' },
      keywords: { en: ['download speed', 'download time', 'file download time', 'network'], ar: ['وقت التحميل', 'سرعة التنزيل', 'تحميل ملف', 'باندويث'] },
      icon: 'Download',
      calculatorType: 'download-speed',
      sortOrder: 2,
      isFeatured: false,
      faqs: [],
    },
    {
      slug: 'file-size',
      categorySlug: 'tech',
      name: { en: 'File Size Converter', ar: 'محول أحجام الملفات' },
      description: { en: 'Convert file size data units between GB, MB, KB, and Bytes', ar: 'حول حجم البيانات بين الجيجابايت، الميجابايت، الكيلوبايت، والبايت' },
      content: {
        en: 'Convert digital storage size measurements using standard binary multipliers (1024).',
        ar: 'حول وحدات التخزين الرقمية للملفات والذاكرة باستخدام مقاييس المضاعفة الثنائية.',
      },
      formulaExplanation: {
        en: '1 KB = 1024 Bytes. 1 MB = 1024 KB. 1 GB = 1024 MB.',
        ar: '1 كيلوبايت = 1024 بايت، 1 ميجابايت = 1024 كيلوبايت، 1 جيجابايت = 1024 ميجابايت.',
      },
      example: {
        en: '1 GB is equal to 1024 MB.',
        ar: '1 جيجابايت تساوي 1024 ميجابايت بالضبط.',
      },
      metaTitle: { en: 'File Size Converter - GB, MB, KB, Bytes', ar: 'محول وحدات التخزين الرقمية وأحجام الملفات' },
      metaDescription: { en: 'Convert storage sizes instantly. Convert between GB, MB, KB, and Bytes.', ar: 'محول أحجام ملفات مجاني لتحويل الميجابايت والجيجابايت والبايت أونلاين.' },
      keywords: { en: ['file size converter', 'gb to mb', 'mb to kb', 'storage converter'], ar: ['تحويل حجم الملف', 'جيجا لميجا', 'كيلوبايت لبايت', 'تخزين رقمي'] },
      icon: 'HardDrive',
      calculatorType: 'file-size',
      sortOrder: 3,
      isFeatured: false,
      faqs: [],
    },
  ];

  for (const calc of calculators) {
    const categoryId = categoryMap[calc.categorySlug];
    if (!categoryId) continue;

    const dbCalc = await prisma.calculator.upsert({
      where: { slug: calc.slug },
      update: {
        categoryId,
        name: calc.name,
        description: calc.description,
        content: calc.content,
        formulaExplanation: calc.formulaExplanation,
        example: calc.example,
        metaTitle: calc.metaTitle,
        metaDescription: calc.metaDescription,
        keywords: calc.keywords,
        icon: calc.icon,
        calculatorType: calc.calculatorType,
        sortOrder: calc.sortOrder,
        isFeatured: calc.isFeatured,
      },
      create: {
        slug: calc.slug,
        categoryId,
        name: calc.name,
        description: calc.description,
        content: calc.content,
        formulaExplanation: calc.formulaExplanation,
        example: calc.example,
        metaTitle: calc.metaTitle,
        metaDescription: calc.metaDescription,
        keywords: calc.keywords,
        icon: calc.icon,
        calculatorType: calc.calculatorType,
        sortOrder: calc.sortOrder,
        isFeatured: calc.isFeatured,
      },
    });

    // Seed FAQs for this calculator
    for (let i = 0; i < calc.faqs.length; i++) {
      const faq = calc.faqs[i];
      // Generate a predictable seed ID or search to avoid duplicates
      await prisma.fAQ.create({
        data: {
          calculatorId: dbCalc.id,
          question: faq.question,
          answer: faq.answer,
          sortOrder: i,
        },
      });
    }
  }

  console.log('Calculators and FAQs seeded.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
