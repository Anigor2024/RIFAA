export type Property = {
  slug: string;
  title: string;
  city: string;
  district: string;
  type: 'فيلا' | 'شقة' | 'بنتهاوس' | 'تاون هاوس' | 'مكتب' | 'أرض';
  purpose: 'للبيع' | 'للإيجار';
  price: number;
  beds: number;
  baths: number;
  area: number;
  image: string;
  gallery: string[];
  badge: string;
  verified: boolean;
  featured?: boolean;
  newBuild?: boolean;
  investment?: boolean;
  yield?: number;
  score: number;
  description: string;
  features: string[];
  neighborhoodSlug: string;
  coordinates: { x: number; y: number };
};

export const properties: Property[] = [
  {
    slug:'villa-al-sidr-hittin', title:'فيلا السِدر', city:'الرياض', district:'حطين', type:'فيلا', purpose:'للبيع', price:6850000, beds:5, baths:7, area:620,
    image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=88',
    gallery:[
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=88',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=88',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88'
    ], badge:'حصري', verified:true, featured:true, newBuild:true, score:94,
    description:'فيلا معاصرة بهوية هادئة ومجلس مستقل وصالة مزدوجة الارتفاع وحديقة داخلية. نموذج العرض يوضح كيف يمكن تقديم العقار الفاخر بمحتوى بصري وبيانات غنية.',
    features:['مصعد داخلي','مسبح خاص','مجلس مستقل','غرفة سائق','نظام منزل ذكي','مواقف 3 سيارات'], neighborhoodSlug:'hittin', coordinates:{x:72,y:32}
  },
  {
    slug:'sky-27-penthouse', title:'بنتهاوس سكاي 27', city:'الرياض', district:'العقيق', type:'بنتهاوس', purpose:'للبيع', price:4300000, beds:4, baths:5, area:390,
    image:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=88',
    gallery:['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=88','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88'],
    badge:'إطلالة بانورامية', verified:true, featured:true, score:91,
    description:'بنتهاوس بواجهات زجاجية وتراس خاص، مع توزيع مفتوح ومساحات استقبال واسعة وإطلالة حضرية.',
    features:['تراس خاص','دخول ذكي','غرفة خادمة','مخزن','نوافذ بانورامية'], neighborhoodSlug:'alaqiq', coordinates:{x:58,y:26}
  },
  {
    slug:'jeddah-waterfront-residence', title:'شقة واجهة البحر', city:'جدة', district:'الشاطئ', type:'شقة', purpose:'للبيع', price:2150000, beds:3, baths:4, area:245,
    image:'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=88',
    gallery:['https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=88','https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=88'],
    badge:'واجهة بحرية', verified:true, newBuild:true, investment:true, yield:5.9, score:90,
    description:'وحدة سكنية راقية قريبة من الواجهة البحرية، مناسبة للسكن والاستثمار طويل الأجل.',
    features:['إطلالة بحرية','شرفة','مواقف خاصة','أمن 24/7','نادي سكان'], neighborhoodSlug:'jeddah-waterfront', coordinates:{x:18,y:64}
  },
  {
    slug:'dar-alnakheel-diriyah', title:'دار النخيل', city:'الدرعية', district:'سمحان', type:'فيلا', purpose:'للبيع', price:3350000, beds:4, baths:5, area:410,
    image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=88',
    gallery:['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=88','https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=88'],
    badge:'مشروع جديد', verified:true, newBuild:true, featured:true, score:93,
    description:'منزل بهوية نجدية معاصرة ضمن مشروع منخفض الكثافة ومساحات خضراء وخدمات مجتمعية.',
    features:['فناء داخلي','جلسات خارجية','مطبخ تحضيري','غرفة خادمة','تصميم نجدي معاصر'], neighborhoodSlug:'diriyah', coordinates:{x:42,y:42}
  },
  {
    slug:'kafd-business-loft', title:'لوفت الأعمال', city:'الرياض', district:'كافد', type:'مكتب', purpose:'للإيجار', price:420000, beds:0, baths:2, area:180,
    image:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=88',
    gallery:['https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=88','https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=88'],
    badge:'جاهز للتشغيل', verified:true, investment:true, yield:7.1, score:89,
    description:'مكتب فاخر جاهز للتشغيل ضمن منطقة أعمال متقدمة بمساحات مرنة للاجتماعات والعمل.',
    features:['مفروش بالكامل','غرف اجتماعات','استقبال','مواقف مخصصة','دخول ذكي'], neighborhoodSlug:'kafd', coordinates:{x:66,y:48}
  },
  {
    slug:'alnarjis-investment-land', title:'أرض بوابة الرياض', city:'الرياض', district:'النرجس', type:'أرض', purpose:'للبيع', price:2950000, beds:0, baths:0, area:900,
    image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=88',
    gallery:['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=88'],
    badge:'فرصة استثمارية', verified:true, investment:true, score:87,
    description:'قطعة أرض سكنية بموقع واعد وسهولة وصول، مناسبة لتطوير سكني خاص أو مشروع استثماري.',
    features:['شارع 30م','واجهة شمالية','قرب الخدمات','منطقة نمو'], neighborhoodSlug:'alnarjis', coordinates:{x:74,y:18}
  },
  {
    slug:'almarjan-villa-jeddah', title:'فيلا المرجان', city:'جدة', district:'أبحر الشمالية', type:'فيلا', purpose:'للبيع', price:7900000, beds:6, baths:8, area:760,
    image:'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=88',
    gallery:['https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1600&q=88','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=88'],
    badge:'فاخر', verified:true, featured:true, score:95,
    description:'فيلا كبيرة بمسبح خاص وتفاصيل حجرية ومساحات ضيافة وخصوصية عائلية عالية.',
    features:['مسبح','مصعد','سينما منزلية','صالة رياضية','حديقة','جناح ضيوف'], neighborhoodSlug:'obhur', coordinates:{x:14,y:72}
  },
  {
    slug:'khobar-townhouse', title:'تاون هاوس المروج', city:'الخبر', district:'العليا', type:'تاون هاوس', purpose:'للبيع', price:1780000, beds:4, baths:4, area:310,
    image:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=88',
    gallery:['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=88'],
    badge:'جاهز للسكن', verified:true, newBuild:true, score:86,
    description:'تاون هاوس عائلي بتصميم عملي ومساحات متعددة الاستخدام وقريب من الخدمات والمحاور.',
    features:['حديقة خلفية','موقفان','غرفة خادمة','مخزن'], neighborhoodSlug:'khobar-olaya', coordinates:{x:90,y:66}
  },
  {
    slug:'rawdah-rental-jeddah', title:'شقة الروضة', city:'جدة', district:'الروضة', type:'شقة', purpose:'للإيجار', price:155000, beds:3, baths:3, area:205,
    image:'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=88',
    gallery:['https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88'],
    badge:'سنوي', verified:true, score:84,
    description:'شقة هادئة بإضاءة طبيعية ومطبخ مجهز ومساحات تخزين جيدة ضمن مبنى راق.',
    features:['مطبخ مجهز','دخول ذكي','موقف خاص','حراسة'], neighborhoodSlug:'jeddah-rawdah', coordinates:{x:24,y:59}
  }
];

export const projects = [
  {slug:'dar-al-sidr',name:'دار السِدر',city:'الدرعية',type:'مجتمع سكني فاخر',units:84,from:2850000,delivery:'الربع الرابع 2028',progress:42,image:'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=88',description:'مجتمع سكني منخفض الكثافة بهوية نجدية معاصرة وممرات خضراء وخدمات ضيافة.',amenities:['نادي سكان','مسارات مشي','حدائق خاصة','بوابات ذكية','كونسيرج']},
  {slug:'sahab-jeddah',name:'سحاب جدة',city:'جدة',type:'أبراج سكنية بحرية',units:132,from:1900000,delivery:'الربع الثاني 2029',progress:28,image:'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=88',description:'مشروع رأسي فاخر بإطلالات بحرية وخدمات ضيافة ونادٍ صحي ومساحات عمل مشتركة.',amenities:['مسبح مرتفع','نادي صحي','صالة سكان','خدمة صف سيارات','مساحات عمل']},
  {slug:'nukhbat-khobar',name:'نخبة الخبر',city:'الخبر',type:'فلل وتاون هاوس',units:67,from:1650000,delivery:'الربع الأول 2028',progress:61,image:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1600&q=88',description:'حي سكني عائلي متكامل بخيارات فلل وتاون هاوس ومساحات خضراء وخدمات يومية.',amenities:['حدائق','منطقة أطفال','مسجد','متاجر يومية','بوابة أمنية']}
];

export const neighborhoods = [
  {slug:'hittin',name:'حطين',city:'الرياض',label:'فاخر · شمال الرياض',score:94,demand:'مرتفع جدًا',walk:'متوسط',family:'ممتاز',price:'9,500 – 14,000 ر.س/م²',summary:'واحد من أبرز أحياء شمال الرياض للعقارات الراقية، قريب من وجهات الترفيه والمحاور الرئيسية.',image:'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1400&q=86'},
  {slug:'alnarjis',name:'النرجس',city:'الرياض',label:'نمو قوي · شمال الرياض',score:89,demand:'مرتفع',walk:'متوسط',family:'ممتاز',price:'6,800 – 10,500 ر.س/م²',summary:'منطقة توسع سكني نشطة تجمع بين الفلل والأراضي وفرص التطوير.',image:'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=86'},
  {slug:'kafd',name:'كافد',city:'الرياض',label:'أعمال · مركزي',score:92,demand:'مرتفع جدًا',walk:'ممتاز',family:'جيد',price:'تجاري وسكني مرتفع',summary:'مركز أعمال حديث مناسب للمكاتب والوحدات السكنية ذات الطابع الحضري.',image:'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1400&q=86'},
  {slug:'diriyah',name:'الدرعية',city:'الدرعية',label:'تراثي · فاخر',score:95,demand:'مرتفع جدًا',walk:'جيد',family:'ممتاز',price:'قطاع فاخر ومتفاوت',summary:'وجهة استثنائية تجمع القيمة التراثية بالمشاريع الفاخرة الجديدة.',image:'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1400&q=86'},
  {slug:'jeddah-waterfront',name:'واجهة جدة',city:'جدة',label:'بحري · أسلوب حياة',score:91,demand:'مرتفع',walk:'ممتاز',family:'ممتاز',price:'8,000 – 13,500 ر.س/م²',summary:'منطقة ساحلية مرغوبة للسكن والاستثمار قصير وطويل الأجل.',image:'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1400&q=86'}
];

export const advisors = [
  {name:'سارة العتيبي',role:'استشارية عقارات سكنية فاخرة',city:'الرياض',focus:'فلل · بنتهاوس · أحياء شمال الرياض',rating:'4.9',image:'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85'},
  {name:'خالد الحربي',role:'مستشار استثمار وتطوير',city:'الرياض',focus:'أراضٍ · عوائد · مشاريع تحت التطوير',rating:'4.9',image:'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85'},
  {name:'ريم الغامدي',role:'استشارية الساحل الغربي',city:'جدة',focus:'واجهة بحرية · أبحر · وحدات استثمارية',rating:'4.8',image:'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=85'}
];

export function money(n:number){return new Intl.NumberFormat('ar-SA').format(n)}
export function getProperty(slug:string){return properties.find(p=>p.slug===slug)}
export function getProject(slug:string){return projects.find(p=>p.slug===slug)}
export function getNeighborhood(slug:string){return neighborhoods.find(n=>n.slug===slug)}
