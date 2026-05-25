import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import { UZ_EN_BASICS } from './content/uz-en-basics'
import { COMMON_WORDS } from './words-seed'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

// Compact format: [type, question, correctAnswer, wrongAnswers[], difficulty?, explanation?]
type Ex = [string, string, string, string[], number?, string?]

// ──────────────────────────────────────────────────────────
// EXERCISE CONTENT — 500 ta savol (O'zbek → Ingliz)
// ──────────────────────────────────────────────────────────

const U1L1: Ex[] = [ // Salomlashish
  ['TRANSLATE_TEXT','Salom','Hello',['Goodbye','Thank you','Please'],1],
  ['TRANSLATE_TEXT','Xayr','Goodbye',['Hello','Sorry','Thanks'],1],
  ['TRANSLATE_TEXT','Rahmat','Thank you',['Sorry','Goodbye','Hello'],1],
  ['TRANSLATE_TEXT','Iltimos','Please',['Thank you','Sorry','Yes'],1],
  ['TRANSLATE_TEXT','Kechirasiz','Sorry',['Please','Hello','Goodbye'],1],
  ['TRANSLATE_TEXT','Ha','Yes',['No','Maybe','Please'],1],
  ['TRANSLATE_TEXT',"Yo'q",'No',['Yes','Maybe','Hello'],1],
  ['MULTIPLE_CHOICE','"Salom" inglizcha nima?','Hello',['Goodbye','Thank you','Please'],1],
  ['MULTIPLE_CHOICE','"Thank you" o\'zbekcha...','Rahmat',['Salom','Xayr','Iltimos'],1],
  ['BUILD_SENTENCE','Salom, qandaysiz? (inglizcha)','Hello, how are you?',['when','what','where'],1],
]
const U1L2: Ex[] = [ // O'zini tanishtirish
  ['TRANSLATE_TEXT','Mening ismim Kamola.','My name is Kamola.',['Her name is Kamola.','I am Kamola.','Your name is Kamola.'],1],
  ['TRANSLATE_TEXT','Men o\'quvchiman.','I am a student.',['I am a teacher.','I am a doctor.','I am a worker.'],1],
  ['TRANSLATE_TEXT','Men O\'zbekistonliktman.','I am from Uzbekistan.',['I live in Uzbekistan.','I visit Uzbekistan.','I know Uzbekistan.'],1],
  ['TRANSLATE_TEXT','Xursand bo\'ldim.','Nice to meet you.',['See you later.','Goodbye.','How are you?'],1],
  ['TRANSLATE_TEXT','Siz kimsiniz?','Who are you?',['Where are you?','How are you?','What are you?'],1],
  ['MULTIPLE_CHOICE','"My name is" o\'zbekcha nima?','Mening ismim',['Sening ismim','Uning ismim','Bizning ismimiz'],1],
  ['MULTIPLE_CHOICE','"Men o\'quvchiman" inglizcha...','I am a student',['I am a teacher','I am a doctor','I am a cook'],1],
  ['FILL_IN_BLANK','My name ___ Jasur.','is',['am','are','be'],1],
  ['FILL_IN_BLANK','I ___ from Uzbekistan.','am',['is','are','be'],1],
  ['BUILD_SENTENCE','Men O\'zbekistonliktman (inglizcha)','I am from Uzbekistan',['she','he','we'],1],
]
const U1L3: Ex[] = [ // Raqamlar 1-10
  ['TRANSLATE_TEXT','Bir','One',['Two','Three','Four'],1],
  ['TRANSLATE_TEXT','Ikki','Two',['One','Three','Four'],1],
  ['TRANSLATE_TEXT','Uch','Three',['Two','One','Four'],1],
  ['TRANSLATE_TEXT','To\'rt','Four',['Three','Five','Six'],1],
  ['TRANSLATE_TEXT','Besh','Five',['Four','Six','Seven'],1],
  ['TRANSLATE_TEXT','Olti','Six',['Five','Seven','Eight'],1],
  ['TRANSLATE_TEXT','Yetti','Seven',['Six','Eight','Nine'],1],
  ['TRANSLATE_TEXT','Sakkiz','Eight',['Seven','Nine','Ten'],1],
  ['TRANSLATE_TEXT','To\'qqiz','Nine',['Eight','Seven','Ten'],1],
  ['TRANSLATE_TEXT','O\'n','Ten',['Nine','Eight','Eleven'],1],
]
const U1L4: Ex[] = [ // Ranglar
  ['TRANSLATE_TEXT','Qizil','Red',['Blue','Green','Yellow'],1],
  ['TRANSLATE_TEXT','Ko\'k','Blue',['Red','Green','Yellow'],1],
  ['TRANSLATE_TEXT','Yashil','Green',['Red','Blue','Yellow'],1],
  ['TRANSLATE_TEXT','Sariq','Yellow',['Red','Blue','Green'],1],
  ['TRANSLATE_TEXT','Oq','White',['Black','Gray','Brown'],1],
  ['TRANSLATE_TEXT','Qora','Black',['White','Gray','Brown'],1],
  ['TRANSLATE_TEXT','To\'q sariq','Orange',['Yellow','Red','Pink'],1],
  ['TRANSLATE_TEXT','Binafsha','Purple',['Pink','Orange','Blue'],1],
  ['TRANSLATE_TEXT','Jigarrang','Brown',['Black','Gray','Orange'],1],
  ['MULTIPLE_CHOICE','"Blue" o\'zbekcha...','Ko\'k',['Qizil','Yashil','Sariq'],1],
]
const U1CP: Ex[] = [ // Checkpoint 1
  ['MULTIPLE_CHOICE','"Hello" o\'zbekcha...','Salom',['Xayr','Rahmat','Iltimos'],1],
  ['TRANSLATE_TEXT','Uch','Three',['Two','Four','One'],1],
  ['TRANSLATE_TEXT','Ko\'k','Blue',['Red','Green','Yellow'],1],
  ['FILL_IN_BLANK','My name ___ Ali.','is',['am','are','were'],1],
  ['MULTIPLE_CHOICE','Qizil inglizcha...','Red',['Blue','Green','Yellow'],1],
  ['TRANSLATE_TEXT','Besh','Five',['Four','Six','Three'],1],
  ['TRANSLATE_TEXT','Rahmat','Thank you',['Please','Sorry','Goodbye'],1],
  ['MULTIPLE_CHOICE','"Two" o\'zbekcha...','Ikki',['Bir','Uch','To\'rt'],1],
  ['BUILD_SENTENCE','Salom, mening ismim Jasur (inglizcha)','Hello, my name is Jasur',['goodbye','her','their'],1],
]

const U2L1: Ex[] = [ // Mevalar
  ['TRANSLATE_TEXT','Olma','Apple',['Banana','Mango','Pear'],1],
  ['TRANSLATE_TEXT','Banan','Banana',['Apple','Orange','Grape'],1],
  ['TRANSLATE_TEXT','Apelsin','Orange',['Apple','Lemon','Mango'],1],
  ['TRANSLATE_TEXT','Uzum','Grape',['Apple','Pear','Cherry'],1],
  ['TRANSLATE_TEXT','Qovun','Melon',['Watermelon','Pumpkin','Mango'],1],
  ['TRANSLATE_TEXT','Tarvuz','Watermelon',['Melon','Pumpkin','Cucumber'],1],
  ['TRANSLATE_TEXT','Shaftoli','Peach',['Plum','Apricot','Cherry'],1],
  ['TRANSLATE_TEXT','Gilos','Cherry',['Grape','Plum','Peach'],1],
  ['TRANSLATE_TEXT','Nok','Pear',['Apple','Plum','Mango'],1],
  ['TRANSLATE_TEXT','Limon','Lemon',['Orange','Lime','Grapefruit'],1],
]
const U2L2: Ex[] = [ // Sabzavotlar
  ['TRANSLATE_TEXT','Pomidor','Tomato',['Cucumber','Potato','Carrot'],1],
  ['TRANSLATE_TEXT','Bodring','Cucumber',['Tomato','Potato','Carrot'],1],
  ['TRANSLATE_TEXT','Kartoshka','Potato',['Tomato','Cucumber','Onion'],1],
  ['TRANSLATE_TEXT','Sabzi','Carrot',['Potato','Onion','Beet'],1],
  ['TRANSLATE_TEXT','Piyoz','Onion',['Garlic','Carrot','Leek'],1],
  ['TRANSLATE_TEXT','Sarimsoq','Garlic',['Onion','Ginger','Pepper'],1],
  ['TRANSLATE_TEXT','Karam','Cabbage',['Lettuce','Spinach','Broccoli'],1],
  ['TRANSLATE_TEXT','Qalampir','Pepper',['Chili','Onion','Garlic'],1],
  ['TRANSLATE_TEXT','Baqlajon','Eggplant',['Zucchini','Pepper','Cabbage'],1],
  ['TRANSLATE_TEXT','Lavlagi','Beet',['Carrot','Turnip','Radish'],1],
]
const U2L3: Ex[] = [ // Ichimliklar
  ['TRANSLATE_TEXT','Suv','Water',['Juice','Milk','Tea'],1],
  ['TRANSLATE_TEXT','Choy','Tea',['Coffee','Water','Juice'],1],
  ['TRANSLATE_TEXT','Qahva','Coffee',['Tea','Milk','Juice'],1],
  ['TRANSLATE_TEXT','Sharbat','Juice',['Tea','Water','Soda'],1],
  ['TRANSLATE_TEXT','Sut','Milk',['Juice','Water','Cream'],1],
  ['MULTIPLE_CHOICE','"Water" o\'zbekcha...','Suv',['Sut','Sharbat','Choy'],1],
  ['MULTIPLE_CHOICE','"Coffee" o\'zbekcha...','Qahva',['Choy','Sut','Suv'],1],
  ['FILL_IN_BLANK','I drink ___ every morning.','coffee',['juice','water','milk'],1],
  ['BUILD_SENTENCE','Men har kuni choy ichaman (inglizcha)','I drink tea every day',['coffee','milk','juice'],1],
  ['TRANSLATE_TEXT','Limonad','Lemonade',['Juice','Soda','Milk'],1],
]
const U2L4: Ex[] = [ // Taomlar
  ['TRANSLATE_TEXT','Non','Bread',['Rice','Meat','Egg'],1],
  ['TRANSLATE_TEXT','Guruch','Rice',['Bread','Flour','Wheat'],1],
  ['TRANSLATE_TEXT','Go\'sht','Meat',['Fish','Chicken','Bread'],1],
  ['TRANSLATE_TEXT','Tovuq','Chicken',['Meat','Fish','Duck'],1],
  ['TRANSLATE_TEXT','Baliq','Fish',['Meat','Chicken','Shrimp'],1],
  ['TRANSLATE_TEXT','Tuxum','Egg',['Milk','Cheese','Butter'],1],
  ['TRANSLATE_TEXT','Pishloq','Cheese',['Butter','Milk','Cream'],1],
  ['TRANSLATE_TEXT','Tuz','Salt',['Sugar','Pepper','Spice'],1],
  ['TRANSLATE_TEXT','Qand','Sugar',['Salt','Honey','Syrup'],1],
  ['MULTIPLE_CHOICE','"Bread" o\'zbekcha...','Non',['Guruch','Go\'sht','Tuxum'],1],
]
const U2CP: Ex[] = [ // Checkpoint 2
  ['TRANSLATE_TEXT','Olma','Apple',['Banana','Pear','Grape'],1],
  ['TRANSLATE_TEXT','Pomidor','Tomato',['Cucumber','Potato','Onion'],1],
  ['TRANSLATE_TEXT','Suv','Water',['Milk','Juice','Tea'],1],
  ['TRANSLATE_TEXT','Non','Bread',['Rice','Meat','Egg'],1],
  ['MULTIPLE_CHOICE','"Lemon" o\'zbekcha...','Limon',['Apelsin','Banan','Uzum'],1],
  ['MULTIPLE_CHOICE','"Chicken" o\'zbekcha...','Tovuq',['Baliq','Go\'sht','Tuxum'],1],
  ['FILL_IN_BLANK','I eat ___ for breakfast.','bread',['meat','juice','rice'],1],
  ['TRANSLATE_TEXT','Sabzi','Carrot',['Onion','Beet','Garlic'],1],
  ['TRANSLATE_TEXT','Sut','Milk',['Water','Juice','Tea'],1],
  ['BUILD_SENTENCE','Men olma yeyishni yaxshi ko\'raman (inglizcha)','I love eating apples',['hate','drink','smell'],1],
]

const U3L1: Ex[] = [ // Uy hayvonlari
  ['TRANSLATE_TEXT','Kuchuk','Dog',['Cat','Bird','Rabbit'],1],
  ['TRANSLATE_TEXT','Mushuk','Cat',['Dog','Rabbit','Hamster'],1],
  ['TRANSLATE_TEXT','Quyon','Rabbit',['Cat','Mouse','Hamster'],1],
  ['TRANSLATE_TEXT','Ot','Horse',['Cow','Sheep','Donkey'],1],
  ['TRANSLATE_TEXT','Sigir','Cow',['Horse','Sheep','Goat'],1],
  ['TRANSLATE_TEXT','Qo\'y','Sheep',['Cow','Goat','Pig'],1],
  ['TRANSLATE_TEXT','Echki','Goat',['Sheep','Cow','Deer'],1],
  ['TRANSLATE_TEXT','Tovuq','Hen',['Duck','Goose','Turkey'],1],
  ['MULTIPLE_CHOICE','"Dog" o\'zbekcha...','Kuchuk',['Mushuk','Quyon','Ot'],1],
  ['MULTIPLE_CHOICE','"Cat" o\'zbekcha...','Mushuk',['Kuchuk','Quyon','Ot'],1],
]
const U3L2: Ex[] = [ // Yovvoyi hayvonlar
  ['TRANSLATE_TEXT','Sher','Lion',['Tiger','Leopard','Cheetah'],1],
  ['TRANSLATE_TEXT','Yo\'lbars','Tiger',['Lion','Leopard','Jaguar'],1],
  ['TRANSLATE_TEXT','Fil','Elephant',['Hippo','Rhino','Giraffe'],1],
  ['TRANSLATE_TEXT','Ayiq','Bear',['Wolf','Fox','Deer'],1],
  ['TRANSLATE_TEXT','Bo\'ri','Wolf',['Fox','Bear','Coyote'],1],
  ['TRANSLATE_TEXT','Tulki','Fox',['Wolf','Rabbit','Deer'],1],
  ['TRANSLATE_TEXT','Maymun','Monkey',['Ape','Chimp','Gorilla'],1],
  ['TRANSLATE_TEXT','Zebra','Zebra',['Horse','Donkey','Deer'],1],
  ['TRANSLATE_TEXT','Jirafa','Giraffe',['Elephant','Zebra','Rhino'],1],
  ['MULTIPLE_CHOICE','"Lion" o\'zbekcha...','Sher',['Yo\'lbars','Fil','Ayiq'],1],
]
const U3L3: Ex[] = [ // Qushlar
  ['TRANSLATE_TEXT','Burgut','Eagle',['Hawk','Falcon','Owl'],1],
  ['TRANSLATE_TEXT','Kabutar','Pigeon',['Dove','Sparrow','Crow'],1],
  ['TRANSLATE_TEXT','To\'ti','Parrot',['Macaw','Cockatoo','Pigeon'],1],
  ['TRANSLATE_TEXT','Qarg\'a','Crow',['Raven','Magpie','Jackdaw'],1],
  ['TRANSLATE_TEXT','Ho\'roz','Rooster',['Hen','Duck','Turkey'],1],
  ['TRANSLATE_TEXT','O\'rdak','Duck',['Goose','Swan','Pelican'],1],
  ['TRANSLATE_TEXT','Qaz','Goose',['Duck','Swan','Flamingo'],1],
  ['TRANSLATE_TEXT','Chumchuq','Sparrow',['Robin','Finch','Pigeon'],1],
  ['MULTIPLE_CHOICE','"Eagle" o\'zbekcha...','Burgut',['Kabutar','To\'ti','Qarg\'a'],1],
  ['FILL_IN_BLANK','The ___ is a big bird.','eagle',['duck','sparrow','parrot'],1],
]
const U3L4: Ex[] = [ // Suv hayvonlari
  ['TRANSLATE_TEXT','Baliq','Fish',['Whale','Dolphin','Shark'],1],
  ['TRANSLATE_TEXT','Kit','Whale',['Dolphin','Shark','Fish'],1],
  ['TRANSLATE_TEXT','Delfin','Dolphin',['Whale','Shark','Seal'],1],
  ['TRANSLATE_TEXT','Akula','Shark',['Whale','Dolphin','Ray'],1],
  ['TRANSLATE_TEXT','Krakalar','Crab',['Lobster','Shrimp','Crab'],1],
  ['TRANSLATE_TEXT','Medusa','Jellyfish',['Octopus','Squid','Crab'],1],
  ['TRANSLATE_TEXT','Ahtapot','Octopus',['Squid','Jellyfish','Crab'],1],
  ['TRANSLATE_TEXT','Toshbaqa','Turtle',['Frog','Lizard','Crocodile'],1],
  ['MULTIPLE_CHOICE','"Dolphin" o\'zbekcha...','Delfin',['Kit','Akula','Baliq'],1],
  ['MULTIPLE_CHOICE','"Shark" o\'zbekcha...','Akula',['Kit','Delfin','Baliq'],1],
]
const U3CP: Ex[] = [ // Checkpoint 3
  ['TRANSLATE_TEXT','Sher','Lion',['Tiger','Bear','Wolf'],1],
  ['TRANSLATE_TEXT','Mushuk','Cat',['Dog','Rabbit','Horse'],1],
  ['TRANSLATE_TEXT','Burgut','Eagle',['Pigeon','Crow','Duck'],1],
  ['TRANSLATE_TEXT','Akula','Shark',['Whale','Dolphin','Fish'],1],
  ['MULTIPLE_CHOICE','"Tiger" o\'zbekcha...','Yo\'lbars',['Sher','Fil','Ayiq'],1],
  ['MULTIPLE_CHOICE','"Duck" o\'zbekcha...','O\'rdak',['Qaz','Kabutar','Ho\'roz'],1],
  ['FILL_IN_BLANK','A ___ is man\'s best friend.','dog',['cat','rabbit','horse'],1],
  ['TRANSLATE_TEXT','Fil','Elephant',['Rhino','Hippo','Giraffe'],1],
  ['TRANSLATE_TEXT','Delfin','Dolphin',['Whale','Shark','Seal'],1],
  ['BUILD_SENTENCE','Men mushukni yaxshi ko\'raman (inglizcha)','I love cats',['hate','fear','like'],1],
]

const U4L1: Ex[] = [ // Oila a'zolari
  ['TRANSLATE_TEXT','Ota','Father',['Mother','Brother','Uncle'],1],
  ['TRANSLATE_TEXT','Ona','Mother',['Father','Sister','Aunt'],1],
  ['TRANSLATE_TEXT','Aka','Older brother',['Younger brother','Sister','Uncle'],1],
  ['TRANSLATE_TEXT','Uka','Younger brother',['Older brother','Sister','Cousin'],1],
  ['TRANSLATE_TEXT','Opa','Older sister',['Younger sister','Brother','Aunt'],1],
  ['TRANSLATE_TEXT','Bobo','Grandfather',['Grandmother','Uncle','Father'],1],
  ['TRANSLATE_TEXT','Buvi','Grandmother',['Grandfather','Aunt','Mother'],1],
  ['TRANSLATE_TEXT','O\'g\'il','Son',['Daughter','Nephew','Brother'],1],
  ['TRANSLATE_TEXT','Qiz','Daughter',['Son','Niece','Sister'],1],
]
const U4L2: Ex[] = [ // Tanishish muloqoti
  ['TRANSLATE_TEXT','Siz qayerda yashayaniz?','Where do you live?',['Where do you work?','Where do you study?','Where are you from?'],2],
  ['TRANSLATE_TEXT','Men Toshkentda yashayman.','I live in Tashkent.',['I work in Tashkent.','I study in Tashkent.','I am from Tashkent.'],2],
  ['TRANSLATE_TEXT','Siz inglizcha gaplashesizmi?','Do you speak English?',['Can you speak English?','Do you understand English?','Do you write English?'],2],
  ['TRANSLATE_TEXT','Ha, biroz gaplashaman.','Yes, I speak a little.',['Yes, I speak fluently.','No, I don\'t speak.','Maybe a little.'],2],
  ['TRANSLATE_TEXT','Nechanchi yoshdasiz?','How old are you?',['What is your age?','When is your birthday?','Where are you from?'],2],
  ['TRANSLATE_TEXT','Men yigirma yoshdaman.','I am twenty years old.',['I am thirty years old.','I am ten years old.','I will be twenty.'],2],
  ['MULTIPLE_CHOICE','"How old are you?" o\'zbekcha...','Nechanchi yoshdasiz?',['Qayerda yashayaniz?','Ismingiz nima?','Qayerdansiz?'],2],
  ['FILL_IN_BLANK','I ___ twenty years old.','am',['is','are','be'],2],
  ['FILL_IN_BLANK','She lives ___ London.','in',['at','on','by'],2],
  ['BUILD_SENTENCE','Men 25 yoshdaman (inglizcha)','I am 25 years old',['she','he','we'],2],
]
const U4L3: Ex[] = [ // Sifatlar
  ['TRANSLATE_TEXT','Katta','Big',['Small','Large','Huge'],2],
  ['TRANSLATE_TEXT','Kichik','Small',['Big','Little','Tiny'],2],
  ['TRANSLATE_TEXT','Uzun','Long',['Short','Tall','Brief'],2],
  ['TRANSLATE_TEXT','Qisqa','Short',['Long','Tall','Brief'],2],
  ['TRANSLATE_TEXT','Og\'ir','Heavy',['Light','Hard','Dense'],2],
  ['TRANSLATE_TEXT','Yengil','Light',['Heavy','Easy','Thin'],2],
  ['TRANSLATE_TEXT','Issiq','Hot',['Cold','Warm','Cool'],2],
  ['TRANSLATE_TEXT','Sovuq','Cold',['Hot','Cool','Freezing'],2],
  ['TRANSLATE_TEXT','Yangi','New',['Old','Recent','Fresh'],2],
  ['TRANSLATE_TEXT','Eski','Old',['New','Ancient','Aged'],2],
]
const U4L4: Ex[] = [ // Muloqot jumlalari
  ['TRANSLATE_TEXT','Kechirasiz, siz inglizcha gaplashesizmi?','Excuse me, do you speak English?',['Sorry, do you speak English?','Pardon, do you know English?','Hello, speak English?'],2],
  ['TRANSLATE_TEXT','Iltimos, sekinroq gapiring.','Please speak more slowly.',['Please speak louder.','Please repeat that.','Please be quiet.'],2],
  ['TRANSLATE_TEXT','Men tushunmadim.','I don\'t understand.',['I don\'t know.','I can\'t hear.','I don\'t remember.'],2],
  ['TRANSLATE_TEXT','Yana bir marta ayting.','Please say that again.',['Please repeat.','Please explain.','Please continue.'],2],
  ['TRANSLATE_TEXT','Bu inglizcha nima?','What is this in English?',['How do you say this?','What does this mean?','How do you spell this?'],2],
  ['MULTIPLE_CHOICE','"I don\'t understand" o\'zbekcha...','Men tushunmadim',['Men bilmayman','Men eshitmadim','Men ko\'rmadim'],2],
  ['MULTIPLE_CHOICE','"Please" o\'zbekcha...','Iltimos',['Rahmat','Kechirasiz','Salom'],2],
  ['FILL_IN_BLANK','___ speak more slowly, please.','Please',['Sorry','Thank','Excuse'],2],
  ['BUILD_SENTENCE','Men ingliz tilini o\'rganmoqdaman (inglizcha)','I am learning English',['studying','teaching','forgetting'],2],
  ['FILL_IN_BLANK','Excuse ___, do you speak English?','me',['you','him','her'],2],
]
const U4CP: Ex[] = [ // Checkpoint 4
  ['TRANSLATE_TEXT','Ota','Father',['Mother','Son','Uncle'],1],
  ['TRANSLATE_TEXT','Katta','Big',['Small','Short','Heavy'],2],
  ['TRANSLATE_TEXT','Men tushunmadim.','I don\'t understand.',['I don\'t know.','I can\'t hear.','I disagree.'],2],
  ['MULTIPLE_CHOICE','"Grandmother" o\'zbekcha...','Buvi',['Opa','Ona','Singil'],1],
  ['FILL_IN_BLANK','I ___ twenty years old.','am',['is','are','was'],2],
  ['TRANSLATE_TEXT','Sovuq','Cold',['Hot','Warm','Cool'],2],
  ['MULTIPLE_CHOICE','"Daughter" o\'zbekcha...','Qiz',['O\'g\'il','Singil','Opa'],1],
  ['BUILD_SENTENCE','Men Toshkentda yashayman (inglizcha)','I live in Tashkent',['work','study','sleep'],2],
  ['TRANSLATE_TEXT','Yangi','New',['Old','Broken','Used'],2],
  ['FILL_IN_BLANK','Please speak more ___.','slowly',['quickly','loudly','softly'],2],
]

const U5L1: Ex[] = [ // Shahar joylari
  ['TRANSLATE_TEXT','Maktab','School',['University','College','Library'],1],
  ['TRANSLATE_TEXT','Shifoxona','Hospital',['Clinic','Pharmacy','Doctor'],1],
  ['TRANSLATE_TEXT','Bank','Bank',['Hotel','Market','Office'],1],
  ['TRANSLATE_TEXT','Restoran','Restaurant',['Café','Bar','Hotel'],1],
  ['TRANSLATE_TEXT','Mehmonxona','Hotel',['Restaurant','Hospital','School'],1],
  ['TRANSLATE_TEXT','Bozor','Market',['Shop','Store','Mall'],1],
  ['TRANSLATE_TEXT','Muzey','Museum',['Gallery','Theatre','Cinema'],1],
  ['TRANSLATE_TEXT','Bog\'','Park',['Garden','Forest','Yard'],1],
  ['TRANSLATE_TEXT','Aeroporti','Airport',['Station','Port','Terminal'],1],
  ['MULTIPLE_CHOICE','"Hospital" o\'zbekcha...','Shifoxona',['Maktab','Bank','Restoran'],1],
]
const U5L2: Ex[] = [ // Transport
  ['TRANSLATE_TEXT','Mashina','Car',['Bus','Truck','Van'],1],
  ['TRANSLATE_TEXT','Avtobus','Bus',['Car','Truck','Tram'],1],
  ['TRANSLATE_TEXT','Poyezd','Train',['Tram','Subway','Bus'],1],
  ['TRANSLATE_TEXT','Samolyot','Airplane',['Helicopter','Rocket','Glider'],1],
  ['TRANSLATE_TEXT','Taksi','Taxi',['Bus','Car','Van'],1],
  ['TRANSLATE_TEXT','Metro','Subway',['Train','Tram','Bus'],1],
  ['TRANSLATE_TEXT','Velosiped','Bicycle',['Motorcycle','Scooter','Bike'],1],
  ['TRANSLATE_TEXT','Kema','Ship',['Boat','Ferry','Yacht'],1],
  ['MULTIPLE_CHOICE','"Airplane" o\'zbekcha...','Samolyot',['Avtobus','Poyezd','Kema'],1],
  ['FILL_IN_BLANK','I take the ___ to work every day.','bus',['taxi','train','airplane'],1],
]
const U5L3: Ex[] = [ // Yo\'l ko\'rsatish
  ['TRANSLATE_TEXT','O\'ng','Right',['Left','Straight','Back'],1],
  ['TRANSLATE_TEXT','Chap','Left',['Right','Straight','Forward'],1],
  ['TRANSLATE_TEXT','To\'g\'ri boring','Go straight',['Turn right','Turn left','Go back'],1],
  ['TRANSLATE_TEXT','Yaqin','Near',['Far','Close','Next'],1],
  ['TRANSLATE_TEXT','Uzoq','Far',['Near','Close','Next'],1],
  ['TRANSLATE_TEXT','Yuqori','Up / Above',['Down','Below','Under'],1],
  ['TRANSLATE_TEXT','Past','Down / Below',['Up','Above','Over'],1],
  ['MULTIPLE_CHOICE','"Turn right" o\'zbekcha...','O\'ngga buring',['Chapga buring','To\'g\'ri boring','Orqaga qayting'],1],
  ['FILL_IN_BLANK','Turn ___ at the traffic light.','left',['right','straight','back'],1],
  ['BUILD_SENTENCE','Bank yerdan yaqin (inglizcha)','The bank is near here',['far','there','away'],2],
]
const U5L4: Ex[] = [ // Mehmonxona / Sayohat
  ['TRANSLATE_TEXT','Xona band qilish','Book a room',['Reserve a seat','Pay a bill','Check out'],2],
  ['TRANSLATE_TEXT','Kirish','Check in',['Check out','Sign up','Log in'],2],
  ['TRANSLATE_TEXT','Chiqish','Check out',['Check in','Leave','Exit'],2],
  ['TRANSLATE_TEXT','Pasport','Passport',['ID card','Visa','Ticket'],1],
  ['TRANSLATE_TEXT','Chipta','Ticket',['Passport','Visa','Card'],1],
  ['TRANSLATE_TEXT','Sumka','Bag / Luggage',['Suitcase','Backpack','Purse'],1],
  ['MULTIPLE_CHOICE','"Passport" o\'zbekcha...','Pasport',['Chipta','Viza','Karta'],1],
  ['FILL_IN_BLANK','I need to ___ in at the hotel.','check',['sign','log','book'],2],
  ['BUILD_SENTENCE','Men uch kunlik xona band qildim (inglizcha)','I booked a room for three days',['two','four','one'],2],
  ['TRANSLATE_TEXT','Mehmondo\'stlik','Hospitality',['Hotel','Service','Tourism'],2],
]
const U5CP: Ex[] = [ // Checkpoint 5
  ['TRANSLATE_TEXT','Maktab','School',['Hospital','Bank','Market'],1],
  ['TRANSLATE_TEXT','Avtobus','Bus',['Car','Train','Taxi'],1],
  ['TRANSLATE_TEXT','O\'ng','Right',['Left','Back','Up'],1],
  ['TRANSLATE_TEXT','Pasport','Passport',['Ticket','Visa','Card'],1],
  ['MULTIPLE_CHOICE','"Subway" o\'zbekcha...','Metro',['Poyezd','Avtobus','Taksi'],1],
  ['FILL_IN_BLANK','The bank is ___ the school.','near',['far','under','above'],1],
  ['BUILD_SENTENCE','Aeroportga qanday borish mumkin? (inglizcha)','How can I get to the airport?',['station','hotel','market'],2],
  ['TRANSLATE_TEXT','Muzey','Museum',['Cinema','Theatre','Gallery'],1],
  ['TRANSLATE_TEXT','Yaqin','Near',['Far','Next','Behind'],1],
  ['TRANSLATE_TEXT','Chipta','Ticket',['Passport','Card','Visa'],1],
]
const U6L1: Ex[] = [ // Vaqt
  ['TRANSLATE_TEXT','Ertalab','Morning',['Afternoon','Evening','Night'],1],
  ['TRANSLATE_TEXT','Kunduz','Afternoon',['Morning','Evening','Midnight'],1],
  ['TRANSLATE_TEXT','Kechqurun','Evening',['Morning','Night','Afternoon'],1],
  ['TRANSLATE_TEXT','Kecha (kecha-kunduz)','Night',['Day','Evening','Dusk'],1],
  ['TRANSLATE_TEXT','Bugun','Today',['Tomorrow','Yesterday','Now'],1],
  ['TRANSLATE_TEXT','Ertaga','Tomorrow',['Today','Yesterday','Later'],1],
  ['TRANSLATE_TEXT','Kecha (o\'tgan kun)','Yesterday',['Today','Tomorrow','Before'],1],
  ['TRANSLATE_TEXT','Hozir','Now',['Later','Soon','Before'],1],
  ['MULTIPLE_CHOICE','"Morning" o\'zbekcha...','Ertalab',['Kunduz','Kechqurun','Kecha'],1],
  ['FILL_IN_BLANK','I study English ___ the morning.','in',['at','on','by'],1],
]
const U6L2: Ex[] = [ // Hafta kunlari
  ['TRANSLATE_TEXT','Dushanba','Monday',['Tuesday','Wednesday','Thursday'],1],
  ['TRANSLATE_TEXT','Seshanba','Tuesday',['Monday','Wednesday','Friday'],1],
  ['TRANSLATE_TEXT','Chorshanba','Wednesday',['Tuesday','Thursday','Monday'],1],
  ['TRANSLATE_TEXT','Payshanba','Thursday',['Wednesday','Friday','Tuesday'],1],
  ['TRANSLATE_TEXT','Juma','Friday',['Thursday','Saturday','Wednesday'],1],
  ['TRANSLATE_TEXT','Shanba','Saturday',['Friday','Sunday','Monday'],1],
  ['TRANSLATE_TEXT','Yakshanba','Sunday',['Saturday','Monday','Friday'],1],
  ['MULTIPLE_CHOICE','"Monday" o\'zbekcha...','Dushanba',['Seshanba','Chorshanba','Payshanba'],1],
  ['FILL_IN_BLANK','I rest on ___.','Sunday',['Monday','Tuesday','Friday'],1],
  ['BUILD_SENTENCE','Juma mening sevimli kunim (inglizcha)','Friday is my favorite day',['Monday','Saturday','Sunday'],1],
]
const U6L3: Ex[] = [ // Oylar
  ['TRANSLATE_TEXT','Yanvar','January',['February','March','April'],1],
  ['TRANSLATE_TEXT','Fevral','February',['January','March','April'],1],
  ['TRANSLATE_TEXT','Mart','March',['February','April','May'],1],
  ['TRANSLATE_TEXT','Aprel','April',['March','May','June'],1],
  ['TRANSLATE_TEXT','May','May',['April','June','July'],1],
  ['TRANSLATE_TEXT','Iyun','June',['May','July','August'],1],
  ['TRANSLATE_TEXT','Iyul','July',['June','August','September'],1],
  ['TRANSLATE_TEXT','Avgust','August',['July','September','October'],1],
  ['TRANSLATE_TEXT','Sentabr','September',['August','October','November'],1],
  ['MULTIPLE_CHOICE','"December" o\'zbekcha...','Dekabr',['Noyabr','Oktyabr','Sentabr'],1],
]
const U6L4: Ex[] = [ // Fasllar
  ['TRANSLATE_TEXT','Bahor','Spring',['Summer','Autumn','Winter'],1],
  ['TRANSLATE_TEXT','Yoz','Summer',['Spring','Autumn','Winter'],1],
  ['TRANSLATE_TEXT','Kuz','Autumn',['Spring','Summer','Winter'],1],
  ['TRANSLATE_TEXT','Qish','Winter',['Spring','Summer','Autumn'],1],
  ['TRANSLATE_TEXT','Qish sovuq.','Winter is cold.',['Winter is hot.','Summer is cold.','Spring is cold.'],1],
  ['TRANSLATE_TEXT','Yoz issiq.','Summer is hot.',['Summer is cold.','Winter is hot.','Autumn is hot.'],1],
  ['MULTIPLE_CHOICE','"Spring" o\'zbekcha...','Bahor',['Yoz','Kuz','Qish'],1],
  ['FILL_IN_BLANK','It is ___ in summer.','hot',['cold','cool','freezing'],1],
  ['FILL_IN_BLANK', 'Autumn is my favorite ___.','season',['month','day','year'],1],
  ['BUILD_SENTENCE', 'Bahor eng yaxshi fasl (inglizcha)','Spring is the best season',['worst','longest','coldest'],1],
]
const U6CP: Ex[] = [ // Checkpoint 6
  ['TRANSLATE_TEXT','Dushanba','Monday',['Wednesday','Friday','Sunday'],1],
  ['TRANSLATE_TEXT','Yoz','Summer',['Winter','Spring','Autumn'],1],
  ['TRANSLATE_TEXT','Bugun','Today',['Tomorrow','Yesterday','Now'],1],
  ['TRANSLATE_TEXT','Mart','March',['April','February','May'],1],
  ['MULTIPLE_CHOICE', '"Friday" o\'zbekcha...','Juma',['Shanba','Yakshanba','Payshanba'],1],
  ['FILL_IN_BLANK', 'I was born in ___.','January',['Spring','Monday','Evening'],1],
  ['BUILD_SENTENCE', 'Bugun Dushanba (inglizcha)','Today is Monday',['Tuesday','Sunday','Friday'],1],
  ['TRANSLATE_TEXT','Ertalab','Morning',['Evening','Night','Afternoon'],1],
  ['TRANSLATE_TEXT','Kuz','Autumn',['Spring','Summer','Winter'],1],
  ['TRANSLATE_TEXT','Ertaga','Tomorrow',['Today','Yesterday','Later'],1],
]
const U7L1: Ex[] = [ // Kasblar
  ['TRANSLATE_TEXT','Shifokor','Doctor',['Nurse','Dentist','Surgeon'],2],
  ['TRANSLATE_TEXT','O\'qituvchi','Teacher',['Professor','Tutor','Lecturer'],2],
  ['TRANSLATE_TEXT','Muhandis','Engineer',['Architect','Designer','Technician'],2],
  ['TRANSLATE_TEXT','Oshpaz','Chef',['Cook','Baker','Waiter'],2],
  ['TRANSLATE_TEXT','Haydovchi','Driver',['Pilot','Captain','Operator'],2],
  ['TRANSLATE_TEXT','Politsiyachi','Police officer',['Soldier','Guard','Inspector'],2],
  ['TRANSLATE_TEXT','Quruvchi','Builder',['Carpenter','Plumber','Electrician'],2],
  ['TRANSLATE_TEXT','Dehqon','Farmer',['Gardener','Fisherman','Herder'],2],
  ['TRANSLATE_TEXT','Rassam','Artist',['Painter','Sculptor','Designer'],2],
  ['TRANSLATE_TEXT','Yozuvchi','Writer',['Poet','Author','Journalist'],2],
]
const U7L2: Ex[] = [ // Ish joyi
  ['TRANSLATE_TEXT','Ofis','Office',['Factory','Workshop','Studio'],2],
  ['TRANSLATE_TEXT','Kasalxona','Hospital',['Clinic','Laboratory','Pharmacy'],2],
  ['TRANSLATE_TEXT','Kutubxona','Library',['Bookstore','Archive','Museum'],2],
  ['TRANSLATE_TEXT','Laboratoriya','Laboratory',['Office','Factory','Studio'],2],
  ['TRANSLATE_TEXT','Fabrika','Factory',['Office','Workshop','Plant'],2],
  ['TRANSLATE_TEXT','Ustaxona','Workshop',['Factory','Office','Studio'],2],
  ['MULTIPLE_CHOICE','"Library" o\'zbekcha...','Kutubxona',['Maktab','Muzey','Do\'kon'],2],
  ['FILL_IN_BLANK', 'A doctor works in a ___.','hospital',['office','school','factory'],2],
  ['BUILD_SENTENCE', 'Men ofisda ishlаyman (inglizcha)','I work in an office',['hospital','school','factory'],2],
]
const U7L3: Ex[] = [ // Kasb ta'riflari
  ['TRANSLATE_TEXT','Shifokor bemorlarni davolaydi.','A doctor treats patients.',['A doctor teaches students.','A doctor cooks food.','A doctor builds houses.'],2],
  ['TRANSLATE_TEXT','O\'qituvchi dars beradi.','A teacher gives lessons.',['A teacher treats patients.','A teacher drives cars.','A teacher cooks food.'],2],
  ['TRANSLATE_TEXT','Oshpaz ovqat pishiradi.','A chef cooks food.',['A chef treats patients.','A chef drives cars.','A chef builds houses.'],2],
  ['TRANSLATE_TEXT','Haydovchi mashina haydaydi.','A driver drives a car.',['A driver cooks food.','A driver builds houses.','A driver treats patients.'],2],
  ['TRANSLATE_TEXT','Quruvchi uy quradi.','A builder builds houses.',['A builder drives cars.','A builder cooks food.','A builder teaches students.'],2],
  ['MULTIPLE_CHOICE', 'A teacher...','gives lessons',['treats patients','cooks food','drives cars'],2],
  ['FILL_IN_BLANK', 'A doctor ___ patients.','treats',['teaches','drives','builds'],2],
  ['FILL_IN_BLANK', 'A chef ___ food.','cooks',['treats','drives','teaches'],2],
  ['BUILD_SENTENCE', 'Men shifokorman (inglizcha)','I am a doctor',['teacher','engineer','driver'],2],
  ['BUILD_SENTENCE', 'U o\'qituvchi (inglizcha)','She is a teacher',['doctor','nurse','student'],2],
]
const U7L4: Ex[] = [ // Ish muloqoti
  ['TRANSLATE_TEXT','Siz qaerda ishlaysiz?','Where do you work?',['Where do you live?','What do you do?','How do you work?'],2],
  ['TRANSLATE_TEXT','Men bankda ishlаyman.','I work at a bank.',['I work at a school.','I work at a hospital.','I work from home.'],2],
  ['TRANSLATE_TEXT','Ish vaqti qachon boshlanadi?','When does work start?',['When does work end?','How long do you work?','Where is your work?'],2],
  ['TRANSLATE_TEXT','Soat to\'qqizda.','At nine o\'clock.',['At ten o\'clock.','At eight o\'clock.','At noon.'],2],
  ['TRANSLATE_TEXT','Ish haqi qancha?','What is the salary?',['When is payday?','Do you have a raise?','What is your job?'],2],
  ['MULTIPLE_CHOICE', '"Where do you work?" o\'zbekcha...','Siz qaerda ishlaysiz?',['Siz kimsiniz?','Siz qachon ishlaysiz?','Siz nima qilasiz?'],2],
  ['FILL_IN_BLANK', 'I work ___ a hospital.','at',['in','on','by'],2],
  ['FILL_IN_BLANK', 'Work starts ___ 9 o\'clock.','at',['in','on','by'],2],
  ['BUILD_SENTENCE', 'Men soat 9 da ishni boshlayman (inglizcha)','I start work at 9 o\'clock',['10','8','noon'],2],
  ['TRANSLATE_TEXT','Dam olish kuni','Day off',['Holiday','Weekend','Break'],2],
]
const U7CP: Ex[] = [ // Checkpoint 7
  ['TRANSLATE_TEXT','Shifokor','Doctor',['Teacher','Engineer','Cook'],2],
  ['TRANSLATE_TEXT','Kutubxona','Library',['Hospital','Office','School'],2],
  ['TRANSLATE_TEXT','Men bankda ishlayman.','I work at a bank.',['I study at a bank.','I live at a bank.','I eat at a bank.'],2],
  ['MULTIPLE_CHOICE', '"Chef" o\'zbekcha...','Oshpaz',['Haydovchi','Quruvchi','Dehqon'],2],
  ['FILL_IN_BLANK', 'A doctor ___ patients.','treats',['teaches','builds','drives'],2],
  ['BUILD_SENTENCE', 'U muhandis (inglizcha)','He is an engineer',['doctor','teacher','farmer'],2],
  ['TRANSLATE_TEXT','Oshpaz ovqat pishiradi.','A chef cooks food.',['A chef treats patients.','A chef drives cars.','A chef builds houses.'],2],
  ['TRANSLATE_TEXT','Dam olish kuni','Day off',['Holiday','Break','Vacation'],2],
  ['FILL_IN_BLANK', 'Work ___ at nine o\'clock.','starts',['ends','stops','pauses'],2],
  ['TRANSLATE_TEXT','Rassam','Artist',['Writer','Singer','Dancer'],2],
]
const U8L1: Ex[] = [ // Kiyim turlari
  ['TRANSLATE_TEXT','Ko\'ylak','Shirt',['Pants','Dress','Jacket'],2],
  ['TRANSLATE_TEXT','Shim','Pants',['Shirt','Dress','Shorts'],2],
  ['TRANSLATE_TEXT','Ko\'ylak (ayol)','Dress',['Skirt','Blouse','Shirt'],2],
  ['TRANSLATE_TEXT','Etik','Boots',['Shoes','Sandals','Slippers'],2],
  ['TRANSLATE_TEXT','Tufli','Shoes',['Boots','Sandals','Sneakers'],2],
  ['TRANSLATE_TEXT','Palto','Coat',['Jacket','Sweater','Vest'],2],
  ['TRANSLATE_TEXT','Kurtka','Jacket',['Coat','Vest','Sweater'],2],
  ['TRANSLATE_TEXT','Shlyapa','Hat',['Cap','Helmet','Scarf'],2],
  ['TRANSLATE_TEXT','Qo\'lqop','Gloves',['Scarf','Hat','Socks'],2],
  ['TRANSLATE_TEXT','Sharf','Scarf',['Gloves','Hat','Belt'],2],
]
const U8L2: Ex[] = [ // Bozorda
  ['TRANSLATE_TEXT','Bu qancha turadi?','How much does this cost?',['What is this?','Do you have this?','Can I buy this?'],2],
  ['TRANSLATE_TEXT','Bu juda qimmat.','This is too expensive.',['This is very cheap.','This is nice.','This is too small.'],2],
  ['TRANSLATE_TEXT','Arzonroq narxi bormi?','Is there a cheaper price?',['Do you have a bigger one?','Can I get a discount?','Is this on sale?'],2],
  ['TRANSLATE_TEXT','Menga bu yoqdi.','I like this.',['I don\'t like this.','I want this.','I need this.'],2],
  ['TRANSLATE_TEXT','Menga kichkina o\'lcham kerak.','I need a small size.',['I need a big size.','I need a medium size.','I want this size.'],2],
  ['MULTIPLE_CHOICE','"How much does this cost?" o\'zbekcha...','Bu qancha turadi?',['Bu nima?','Bu qayer?','Bu nechta?'],2],
  ['FILL_IN_BLANK', 'How ___ does this cost?','much',['many','more','less'],2],
  ['FILL_IN_BLANK', 'This is too ___.','expensive',['cheap','small','large'],2],
  ['BUILD_SENTENCE', 'Men ko\'ylak sotib olmoqchiman (inglizcha)','I want to buy a shirt',['jacket','shoes','hat'],2],
  ['TRANSLATE_TEXT','Chegirma','Discount',['Sale','Price','Offer'],2],
]
const U8L3: Ex[] = [ // O\'lcham va ranglar
  ['TRANSLATE_TEXT','Kichkina','Small',['Large','Medium','Tiny'],2],
  ['TRANSLATE_TEXT','O\'rta','Medium',['Small','Large','Average'],2],
  ['TRANSLATE_TEXT','Katta','Large',['Small','Medium','Big'],2],
  ['FILL_IN_BLANK', 'Do you have this in ___ blue?','dark',['light','pale','bright'],2],
  ['FILL_IN_BLANK', 'I wear a ___ size shirt.','medium',['small','large','tiny'],2],
  ['BUILD_SENTENCE', 'Menga qora kurtka kerak (inglizcha)','I need a black jacket',['white','blue','red'],2],
  ['TRANSLATE_TEXT','Qo\'ng\'ir rang ko\'ylak','Brown shirt',['White shirt','Blue shirt','Red shirt'],2],
  ['MULTIPLE_CHOICE','What color is grass?','Green',['Blue','Yellow','Red'],1],
  ['TRANSLATE_TEXT','Och yashil','Light green',['Dark green','Pale green','Bright green'],2],
  ['BUILD_SENTENCE', 'Mening sevimli rangim ko\'k (inglizcha)','My favorite color is blue',['red','green','yellow'],1],
]
const U8L4: Ex[] = [ // Mavsum kiyimlari
  ['TRANSLATE_TEXT','Qishda palto kiyish kerak.','You should wear a coat in winter.',['You should wear a dress in winter.','You should wear shorts in winter.','You should wear sandals in winter.'],2],
  ['TRANSLATE_TEXT','Yozda yengil kiyim yer.','Wear light clothes in summer.',['Wear heavy clothes in summer.','Wear a coat in summer.','Wear boots in summer.'],2],
  ['TRANSLATE_TEXT','Yomg\'irpush','Raincoat',['Jacket','Coat','Poncho'],2],
  ['TRANSLATE_TEXT','Soyabon','Umbrella',['Raincoat','Hat','Cap'],2],
  ['TRANSLATE_TEXT','Paypoq','Socks',['Gloves','Tights','Stockings'],2],
  ['TRANSLATE_TEXT','Sandal','Sandals',['Boots','Sneakers','Slippers'],2],
  ['MULTIPLE_CHOICE','What do you wear in winter?','A coat',['A swimsuit','Sandals','Shorts'],2],
  ['FILL_IN_BLANK', 'Don\'t forget your ___ when it rains.','umbrella',['hat','gloves','boots'],2],
  ['BUILD_SENTENCE', 'Qishda men palto va sharf kiyaman (inglizcha)','In winter I wear a coat and scarf',['gloves','boots','hat'],2],
  ['TRANSLATE_TEXT','Issiq kiyim','Warm clothes',['Cold clothes','Light clothes','Heavy clothes'],2],
]
const U8CP: Ex[] = [ // Checkpoint 8
  ['TRANSLATE_TEXT','Kurtka','Jacket',['Coat','Shirt','Vest'],2],
  ['TRANSLATE_TEXT','Bu qancha turadi?','How much does this cost?',['What is this?','Where is this?','Why is this?'],2],
  ['TRANSLATE_TEXT','Soyabon','Umbrella',['Hat','Raincoat','Scarf'],2],
  ['MULTIPLE_CHOICE', '"Shoes" o\'zbekcha...','Tufli',['Etik','Shim','Ko\'ylak'],2],
  ['FILL_IN_BLANK', 'I need a ___ size.','small',['cheap','expensive','good'],2],
  ['BUILD_SENTENCE','Men qizil ko\'ylak sotib oldim (inglizcha)','I bought a red shirt',['blue','green','black'],2],
  ['TRANSLATE_TEXT','Chegirma','Discount',['Price','Offer','Deal'],2],
  ['TRANSLATE_TEXT','Qo\'lqop','Gloves',['Scarf','Hat','Socks'],2],
  ['FILL_IN_BLANK','It is too ___ — do you have something cheaper?','expensive',['small','heavy','long'],2],
  ['TRANSLATE_TEXT', 'O\'rta','Medium',['Small','Large','Average'],2],
]
const U9L1: Ex[] = [ // Sport
  ['TRANSLATE_TEXT','Futbol','Football',['Basketball','Volleyball','Tennis'],1],
  ['TRANSLATE_TEXT','Basketbol','Basketball',['Football','Volleyball','Tennis'],1],
  ['TRANSLATE_TEXT','Voleybol','Volleyball',['Football','Basketball','Tennis'],1],
  ['TRANSLATE_TEXT','Tennis','Tennis',['Badminton','Squash','Ping-pong'],1],
  ['TRANSLATE_TEXT','Suzish','Swimming',['Running','Diving','Floating'],1],
  ['TRANSLATE_TEXT','Yugurish','Running',['Walking','Swimming','Jumping'],1],
  ['TRANSLATE_TEXT','Boks','Boxing',['Wrestling','Karate','Judo'],1],
  ['TRANSLATE_TEXT','Ko\'rash','Wrestling',['Boxing','Judo','Karate'],1],
  ['TRANSLATE_TEXT','Velosiped minish','Cycling',['Running','Swimming','Skiing'],1],
  ['MULTIPLE_CHOICE', '"Swimming" o\'zbekcha...','Suzish',['Yugurish','Futbol','Tennis'],1],
]
const U9L2: Ex[] = [ // Hobbi
  ['TRANSLATE_TEXT','Kitob o\'qish','Reading',['Writing','Watching','Drawing'],2],
  ['TRANSLATE_TEXT','Musiqa tinglash','Listening to music',['Playing music','Singing','Dancing'],2],
  ['TRANSLATE_TEXT','Rasm chizish','Drawing',['Painting','Writing','Sculpting'],2],
  ['TRANSLATE_TEXT','Raqs tushish','Dancing',['Singing','Acting','Performing'],2],
  ['TRANSLATE_TEXT','Pishirish','Cooking',['Baking','Grilling','Frying'],2],
  ['TRANSLATE_TEXT','Fotografiya','Photography',['Videography','Filmmaking','Drawing'],2],
  ['TRANSLATE_TEXT','O\'yin o\'ynash','Playing games',['Watching games','Selling games','Buying games'],2],
  ['MULTIPLE_CHOICE', '"Reading" o\'zbekcha...','Kitob o\'qish',['Musiqa tinglash','Rasm chizish','Pishirish'],2],
  ['FILL_IN_BLANK','My hobby is ___.','reading',['eating','sleeping','working'],2],
]
const U9L3: Ex[] = [ // Sevimli mashg\'ulotlar
  ['TRANSLATE_TEXT','Mening sevimli sportim futbol.','My favorite sport is football.',['My favorite sport is tennis.','I play football.','Football is a good sport.'],2],
  ['TRANSLATE_TEXT','Men har kuni mashq qilaman.','I exercise every day.',['I exercise sometimes.','I never exercise.','I exercised yesterday.'],2],
  ['TRANSLATE_TEXT','Birga o\'ynaylikmi?','Shall we play together?',['Do you want to play?','Can you play?','Will you play?'],2],
  ['TRANSLATE_TEXT','Ha, albatta!','Yes, of course!',['No, thanks.','Maybe later.','I\'m not sure.'],2],
  ['TRANSLATE_TEXT','Siz qaysi jamoani qo\'llaysiz?','Which team do you support?',['Who is your favorite player?','What sport do you play?','How do you play?'],2],
  ['MULTIPLE_CHOICE', "Exercise" o\'zbekcha...','Mashq qilish',['O\'yin o\'ynash','Sayohat qilish','Pishirish'],2],
  ['FILL_IN_BLANK','I play football ___ weekends.','on',['in','at','by'],2],
  ['FILL_IN_BLANK','She exercises ___ day.','every',['some','all','many'],2],
  ['BUILD_SENTENCE','Men futbol o\'ynashni yaxshi ko\'raman (inglizcha)','I love playing football',['tennis','basketball','volleyball'],2],
  ['BUILD_SENTENCE','Birga futbol o\'ynaymizmi? (inglizcha)','Shall we play football together?',['tennis','basketball','alone'],2],
]
const U9L4: Ex[] = [ // Musiqa
  ['TRANSLATE_TEXT','Qo\'shiq','Song',['Music','Melody','Tune'],2],
  ['TRANSLATE_TEXT','Gitara','Guitar',['Piano','Violin','Drum'],2],
  ['TRANSLATE_TEXT','Piano','Piano',['Guitar','Violin','Cello'],2],
  ['TRANSLATE_TEXT','Doira','Drum',['Guitar','Piano','Flute'],2],
  ['TRANSLATE_TEXT','Nay','Flute',['Drum','Guitar','Violin'],2],
  ['TRANSLATE_TEXT','Skripka','Violin',['Guitar','Cello','Viola'],2],
  ['TRANSLATE_TEXT','Konsert','Concert',['Show','Performance','Event'],2],
  ['TRANSLATE_TEXT','Qo\'shiq aytish','Singing',['Playing music','Dancing','Performing'],2],
  ['MULTIPLE_CHOICE', '"Guitar" o\'zbekcha...','Gitara',['Piano','Doira','Nay'],2],
  ['BUILD_SENTENCE','Men gitara chalishni o\'rganmoqchiman (inglizcha)','I want to learn to play guitar',['piano','drums','violin'],2],
]
const U9CP: Ex[] = [ // Checkpoint 9
  ['TRANSLATE_TEXT','Futbol','Football',['Basketball','Tennis','Swimming'],1],
  ['TRANSLATE_TEXT','Kitob o\'qish','Reading',['Cooking','Dancing','Singing'],2],
  ['TRANSLATE_TEXT','Gitara','Guitar',['Piano','Drum','Flute'],2],
  ['MULTIPLE_CHOICE', '"Swimming" o\'zbekcha...','Suzish',['Yugurish','Boks','Tennis'],1],
  ['FILL_IN_BLANK','My favorite hobby is ___.','reading',['sleeping','eating','working'],2],
  ['BUILD_SENTENCE','Men musiqa tinglashni yaxshi ko\'raman (inglizcha)','I love listening to music',['playing','singing','dancing'],2],
  ['TRANSLATE_TEXT','Men har kuni mashq qilaman.','I exercise every day.',['I play every day.','I rest every day.','I work every day.'],2],
  ['TRANSLATE_TEXT','Konsert','Concert',['Show','Festival','Party'],2],
  ['TRANSLATE_TEXT','Ha, albatta!','Yes, of course!',['No, thanks.','Maybe.','I don\'t know.'],2],
  ['TRANSLATE_TEXT','Ko\'rash','Wrestling',['Boxing','Judo','Karate'],1],
]
const U10L1: Ex[] = [ // Tana qismlari
  ['TRANSLATE_TEXT','Bosh','Head',['Face','Neck','Skull'],2],
  ['TRANSLATE_TEXT','Ko\'z','Eye',['Ear','Nose','Mouth'],2],
  ['TRANSLATE_TEXT','Quloq','Ear',['Ear','Nose','Mouth'],2],
  ['TRANSLATE_TEXT','Burun','Nose',['Eye','Ear','Mouth'],2],
  ['TRANSLATE_TEXT','Og\'iz','Mouth',['Eye','Ear','Nose'],2],
  ['TRANSLATE_TEXT','Qo\'l','Hand / Arm',['Leg','Foot','Finger'],2],
  ['TRANSLATE_TEXT','Oyoq','Leg / Foot',['Hand','Arm','Knee'],2],
  ['TRANSLATE_TEXT','Tish','Tooth',['Bone','Nail','Gum'],2],
  ['TRANSLATE_TEXT','Yurak','Heart',['Lung','Liver','Stomach'],2],
  ['TRANSLATE_TEXT','Oshqozon','Stomach',['Heart','Liver','Lung'],2],
]
const U10L2: Ex[] = [ // Kasallik alomatlari
  ['TRANSLATE_TEXT','Boshim og\'riyapti.','My head hurts.',['My stomach hurts.','My leg hurts.','My arm hurts.'],2],
  ['TRANSLATE_TEXT','Isitmam bor.','I have a fever.',['I have a cold.','I have a cough.','I have a headache.'],2],
  ['TRANSLATE_TEXT','Yo\'tal','Cough',['Cold','Fever','Flu'],2],
  ['TRANSLATE_TEXT','Shamollash','Cold / Flu',['Cough','Fever','Pain'],2],
  ['TRANSLATE_TEXT','Ko\'ngil aynishi','Nausea',['Dizziness','Vomiting','Fainting'],2],
  ['TRANSLATE_TEXT','Charchagan','Tired / Exhausted',['Sick','Weak','Dizzy'],2],
  ['TRANSLATE_TEXT','Qorin og\'riq','Stomachache',['Headache','Backache','Toothache'],2],
  ['MULTIPLE_CHOICE', '"Fever" o\'zbekcha...','Isitma',['Yo\'tal','Shamollash','Bosh og\'riq'],2],
  ['FILL_IN_BLANK','I have a ___.','headache',['fever','cold','cough'],2],
  ['BUILD_SENTENCE','Men shamolladim (inglizcha)','I have a cold',['fever','cough','flu'],2],
]
const U10L3: Ex[] = [ // Shifokorga borish
  ['TRANSLATE_TEXT', 'Qabul xonasi', 'Reception / Waiting room',['Emergency room','Doctor\'s office','Ward'],2],
  ['TRANSLATE_TEXT','Retsept','Prescription',['Recipe','Note','Permission'],2],
  ['TRANSLATE_TEXT','Kasallik varaqasi','Sick leave',['Permission','Holiday','Certificate'],2],
  ['TRANSLATE_TEXT','Tekshirish','Check-up / Examination',['Treatment','Diagnosis','Operation'],2],
  ['TRANSLATE_TEXT','Tashxis','Diagnosis',['Treatment','Check-up','Prescription'],2],
  ['TRANSLATE_TEXT','Davolash','Treatment',['Diagnosis','Check-up','Operation'],2],
  ['TRANSLATE_TEXT','Tez tuzaling!','Get well soon!',['Take care!','Feel better!','Good luck!'],2],
  ['MULTIPLE_CHOICE', '"Prescription" o\'zbekcha...','Retsept',['Tashxis','Tekshirish','Davolash'],2],
  ['FILL_IN_BLANK','The doctor wrote a ___.','prescription',['diagnosis','note','report'],2],
  ['BUILD_SENTENCE','Menga shifokor kerak (inglizcha)','I need a doctor',['dentist','nurse','pharmacist'],2],
]
const U10L4: Ex[] = [ // Dori-darmon
  ['TRANSLATE_TEXT','Tabletka','Tablet / Pill',['Capsule','Syrup','Injection'],2],
  ['TRANSLATE_TEXT','Inyeksiya','Injection',['Tablet','Syrup','Bandage'],2],
  ['TRANSLATE_TEXT','Bandaj','Bandage',['Plaster','Gauze','Tape'],2],
  ['TRANSLATE_TEXT','Antiseptik','Antiseptic',['Antibiotic','Painkiller','Vitamin'],2],
  ['TRANSLATE_TEXT','Vitamin','Vitamin',['Mineral','Supplement','Protein'],2],
  ['TRANSLATE_TEXT','Antibiotik','Antibiotic',['Vitamin','Painkiller','Antiseptic'],2],
  ['TRANSLATE_TEXT','Og\'riq qoldiruvchi','Painkiller',['Antibiotic','Vitamin','Antiseptic'],2],
  ['TRANSLATE_TEXT','Qon tahlili','Blood test',['Urine test','X-ray','Scan'],2],
  ['MULTIPLE_CHOICE', '"Antibiotic" o\'zbekcha...','Antibiotik',['Vitamin','Tabletka','Bandaj'],2],
  ['BUILD_SENTENCE','Shifokor menga dori yozdi (inglizcha)','The doctor prescribed medicine for me',['vitamin','injection','tablet'],2],
]
const U10CP: Ex[] = [ // Checkpoint 10
  ['TRANSLATE_TEXT','Bosh','Head',['Arm','Leg','Chest'],2],
  ['TRANSLATE_TEXT','Isitmam bor.','I have a fever.',['I have a cold.','I have a cough.','I feel sick.'],2],
  ['TRANSLATE_TEXT','Retsept','Prescription',['Diagnosis','Recipe','Note'],2],
  ['TRANSLATE_TEXT','Tabletka','Tablet',['Injection','Syrup','Capsule'],2],
  ['MULTIPLE_CHOICE', '"Cough" o\'zbekcha...','Yo\'tal',['Isitma','Shamollash','Bosh og\'riq'],2],
  ['FILL_IN_BLANK','The doctor gave me a ___.','prescription',['diagnosis','bandage','injection'],2],
  ['BUILD_SENTENCE','Boshim og\'riyapti (inglizcha)','My head hurts',['stomach','leg','arm'],2],
  ['TRANSLATE_TEXT','Tez tuzaling!','Get well soon!',['Take care!','Be careful!','Good luck!'],2],
  ['TRANSLATE_TEXT','Davolash','Treatment',['Diagnosis','Prescription','Check-up'],2],
  ['TRANSLATE_TEXT','Ko\'z','Eye',['Ear','Nose','Mouth'],2],
]

// ──────────────────────────────────────────────────────────
// UNIT DEFINITION
// ──────────────────────────────────────────────────────────
interface UnitDef {
  order: number; title: string; description: string; color: string; icon: string
  lessons: { title: string; type: 'REGULAR'|'CHECKPOINT'; xp: number; exs: Ex[] }[]
}

const UNITS: UnitDef[] = [
  {
    order:1, title:"Asoslar", description:"Salomlashish, o'zini tanishtirish", color:"#58CC02", icon:"⭐",
    lessons:[
      {title:"Salomlashish",         type:"REGULAR",     xp:10, exs:U1L1},
      {title:"O'zini tanishtirish",  type:"REGULAR",     xp:10, exs:U1L2},
      {title:"Raqamlar 1-10",        type:"REGULAR",     xp:10, exs:U1L3},
      {title:"Ranglar",              type:"REGULAR",     xp:10, exs:U1L4},
      {title:"Tekshiruv 1",          type:"CHECKPOINT",  xp:20, exs:U1CP},
    ],
  },
  {
    order:2, title:"Ovqat", description:"Mevalar, sabzavotlar, ichimliklar", color:"#FF9600", icon:"🍎",
    lessons:[
      {title:"Mevalar",      type:"REGULAR",    xp:10, exs:U2L1},
      {title:"Sabzavotlar",  type:"REGULAR",    xp:10, exs:U2L2},
      {title:"Ichimliklar",  type:"REGULAR",    xp:10, exs:U2L3},
      {title:"Taomlar",      type:"REGULAR",    xp:10, exs:U2L4},
      {title:"Tekshiruv 2",  type:"CHECKPOINT", xp:20, exs:U2CP},
    ],
  },
  {
    order:3, title:"Hayvonlar", description:"Uy va yovvoyi hayvonlar", color:"#1CB0F6", icon:"🐾",
    lessons:[
      {title:"Uy hayvonlari",    type:"REGULAR",    xp:10, exs:U3L1},
      {title:"Yovvoyi hayvonlar",type:"REGULAR",    xp:10, exs:U3L2},
      {title:"Qushlar",          type:"REGULAR",    xp:10, exs:U3L3},
      {title:"Suv hayvonlari",   type:"REGULAR",    xp:10, exs:U3L4},
      {title:"Tekshiruv 3",      type:"CHECKPOINT", xp:20, exs:U3CP},
    ],
  },
  {
    order:4, title:"Oila", description:"Oila a'zolari va muloqot", color:"#CE82FF", icon:"👨‍👩‍👧",
    lessons:[
      {title:"Oila a'zolari",  type:"REGULAR",    xp:10, exs:U4L1},
      {title:"Tanishish",      type:"REGULAR",    xp:12, exs:U4L2},
      {title:"Sifatlar",       type:"REGULAR",    xp:12, exs:U4L3},
      {title:"Muloqot",        type:"REGULAR",    xp:12, exs:U4L4},
      {title:"Tekshiruv 4",    type:"CHECKPOINT", xp:25, exs:U4CP},
    ],
  },
  {
    order:5, title:"Joylar", description:"Shahar joylari va sayohat", color:"#FF4B4B", icon:"🗺️",
    lessons:[
      {title:"Shahar joylari",   type:"REGULAR",    xp:12, exs:U5L1},
      {title:"Transport",        type:"REGULAR",    xp:12, exs:U5L2},
      {title:"Yo\'l ko\'rsatish",  type:"REGULAR",    xp:12, exs:U5L3},
      {title:"Mehmonxona",       type:"REGULAR",    xp:12, exs:U5L4},
      {title:"Tekshiruv 5",      type:"CHECKPOINT", xp:25, exs:U5CP},
    ],
  },
  {
    order:6, title:"Vaqt", description:"Hafta kunlari, oylar, fasllar", color:"#89E219", icon:"🕐",
    lessons:[
      {title:"Vaqt so\'zlari",  type:"REGULAR",    xp:12, exs:U6L1},
      {title:"Hafta kunlari",  type:"REGULAR",    xp:12, exs:U6L2},
      {title:"Oylar",          type:"REGULAR",    xp:12, exs:U6L3},
      {title:"Fasllar",        type:"REGULAR",    xp:12, exs:U6L4},
      {title:"Tekshiruv 6",    type:"CHECKPOINT", xp:25, exs:U6CP},
    ],
  },
  {
    order:7, title:"Kasblar", description:"Ish va kasb so\'zlari", color:"#FF9600", icon:"💼",
    lessons:[
      {title:"Kasblar",       type:"REGULAR",    xp:15, exs:U7L1},
      {title:"Ish joyi",      type:"REGULAR",    xp:15, exs:U7L2},
      {title:"Kasb ta\'riflari",type:"REGULAR",   xp:15, exs:U7L3},
      {title:"Ish muloqoti",  type:"REGULAR",    xp:15, exs:U7L4},
      {title:"Tekshiruv 7",   type:"CHECKPOINT", xp:30, exs:U7CP},
    ],
  },
  {
    order:8, title:"Kiyim", description:"Kiyim va bozor", color:"#CE82FF", icon:"👗",
    lessons:[
      {title:"Kiyim turlari",      type:"REGULAR",    xp:15, exs:U8L1},
      {title:"Bozorda",            type:"REGULAR",    xp:15, exs:U8L2},
      {title:"O\'lcham va ranglar", type:"REGULAR",    xp:15, exs:U8L3},
      {title:"Mavsum kiyimlari",   type:"REGULAR",    xp:15, exs:U8L4},
      {title:"Tekshiruv 8",        type:"CHECKPOINT", xp:30, exs:U8CP},
    ],
  },
  {
    order:9, title:"Sport va Hobbi", description:"Faol dam olish", color:"#58CC02", icon:"⚽",
    lessons:[
      {title:"Sport turlari",        type:"REGULAR",    xp:15, exs:U9L1},
      {title:"Hobbi",                type:"REGULAR",    xp:15, exs:U9L2},
      {title:"Sevimli mashg\'ulotlar",type:"REGULAR",    xp:15, exs:U9L3},
      {title:"Musiqa",               type:"REGULAR",    xp:15, exs:U9L4},
      {title:"Tekshiruv 9",          type:"CHECKPOINT", xp:30, exs:U9CP},
    ],
  },
  {
    order:10, title:"Sog\'liq", description:"Tana qismlari va salomatlik", color:"#FF4B4B", icon:"🏥",
    lessons:[
      {title:"Tana qismlari",       type:"REGULAR",    xp:15, exs:U10L1},
      {title:"Kasallik alomatlari", type:"REGULAR",    xp:15, exs:U10L2},
      {title:"Shifokorga borish",   type:"REGULAR",    xp:15, exs:U10L3},
      {title:"Dori-darmon",         type:"REGULAR",    xp:15, exs:U10L4},
      {title:"Tekshiruv 10",        type:"CHECKPOINT", xp:30, exs:U10CP},
    ],
  },
]

// ──────────────────────────────────────────────────────────
// MAIN
// ──────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seed boshlandi...')

  // Tillar
  const [uz, en] = await Promise.all([
    prisma.language.upsert({
      where: { code:'uz' }, update:{},
      create:{ code:'uz', name:"O'zbek tili", nativeName:"O'zbek", flag:'🇺🇿' },
    }),
    prisma.language.upsert({
      where:{ code:'en' }, update:{},
      create:{ code:'en', name:'Ingliz tili', nativeName:'English', flag:'🇬🇧' },
    }),
  ])
  await prisma.language.upsert({
    where:{ code:'ru' }, update:{},
    create:{ code:'ru', name:'Rus tili', nativeName:'Русский', flag:'🇷🇺' },
  })

  // Kurs: O'zbek → Ingliz
  const course = await prisma.course.upsert({
    where:{ fromLanguageId_toLanguageId:{ fromLanguageId:uz.id, toLanguageId:en.id } },
    update:{},
    create:{ fromLanguageId:uz.id, toLanguageId:en.id, isActive:true },
  })

  let totalEx = 0

  for (const ud of UNITS) {
    const unit = await prisma.unit.upsert({
      where:{ id:`unit-${ud.order}` },
      update:{ title:ud.title, description:ud.description, color:ud.color, icon:ud.icon },
      create:{ id:`unit-${ud.order}`, courseId:course.id, order:ud.order, title:ud.title, description:ud.description, color:ud.color, icon:ud.icon },
    })

    for (let li=0; li<ud.lessons.length; li++) {
      const ld = ud.lessons[li]
      const lessonId = `lesson-u${ud.order}-l${li+1}`

      const lesson = await prisma.lesson.upsert({
        where:{ id:lessonId },
        update:{ type:ld.type, xpReward:ld.xp },
        create:{ id:lessonId, unitId:unit.id, order:li+1, type:ld.type, xpReward:ld.xp },
      })

      for (let ei=0; ei<ld.exs.length; ei++) {
        const [type,question,correctAnswer,wrongAnswers,difficulty=1] = ld.exs[ei]
        const exId = `ex-u${ud.order}-l${li+1}-e${ei+1}`

        const exercise = await prisma.exercise.upsert({
          where:{ id:exId },
          update:{ type:type as any, question, correctAnswer, wrongAnswers, difficulty },
          create:{ id:exId, type:type as any, question, correctAnswer, wrongAnswers, difficulty, targetLangCode:'en' },
        })

        await prisma.lessonExercise.upsert({
          where:{ lessonId_exerciseId:{ lessonId:lesson.id, exerciseId:exercise.id } },
          update:{ order:ei+1 },
          create:{ lessonId:lesson.id, exerciseId:exercise.id, order:ei+1 },
        })
        totalEx++
      }
    }
    console.log(`  ✅ Unit ${ud.order}: ${ud.title}`)
  }

  // Ligalar
  const leagues = [
    { id:'league-1',  name:'Bronze',   order:1,  color:'#CD7F32', icon:'🥉' },
    { id:'league-2',  name:'Silver',   order:2,  color:'#C0C0C0', icon:'🥈' },
    { id:'league-3',  name:'Gold',     order:3,  color:'#FFD700', icon:'🥇' },
    { id:'league-4',  name:'Sapphire', order:4,  color:'#0F52BA', icon:'💙' },
    { id:'league-5',  name:'Ruby',     order:5,  color:'#E0115F', icon:'❤️' },
    { id:'league-6',  name:'Emerald',  order:6,  color:'#50C878', icon:'💚' },
    { id:'league-7',  name:'Amethyst', order:7,  color:'#9966CC', icon:'💜' },
    { id:'league-8',  name:'Pearl',    order:8,  color:'#EAE0C8', icon:'🤍' },
    { id:'league-9',  name:'Obsidian', order:9,  color:'#3D3635', icon:'🖤' },
    { id:'league-10', name:'Diamond',  order:10, color:'#B9F2FF', icon:'💎' },
  ]
  for (const l of leagues) {
    const existing = await prisma.league.findFirst({ where: { order: l.order } })
    if (existing) {
      await prisma.league.update({
        where: { id: existing.id },
        data: { name: l.name, color: l.color, icon: l.icon, order: l.order },
      })
    } else {
      await prisma.league.create({ data: l })
    }
  }

  // Achievementlar
  const achievements = [
    { key:'STREAK_7',    title:'7 kun ketma-ket',   description:'Bir hafta uzluksiz o\'qidingiz!', icon:'🔥', gemReward:50,  xpReward:100  },
    { key:'STREAK_30',   title:'30 kun ketma-ket',  description:'Bir oy uzluksiz!',                icon:'🔥', gemReward:200, xpReward:500  },
    { key:'STREAK_100',  title:'100 kun ketma-ket', description:'Aql bovar qilmas!',               icon:'🌟', gemReward:500, xpReward:2000 },
    { key:'WORDS_100',   title:'100 ta so\'z',       description:'100 ta so\'z bilib oldingiz!',    icon:'📖', gemReward:50,  xpReward:100  },
    { key:'FIRST_LESSON',title:'Birinchi dars!',    description:'Birinchi darsni tugatdingiz!',    icon:'🎉', gemReward:10,  xpReward:20   },
    { key:'PERFECT',     title:'Mukammal dars!',    description:'Xatosiz darsni tugatdingiz!',     icon:'⭐', gemReward:20,  xpReward:50   },
  ]
  for (const a of achievements) {
    await prisma.achievement.upsert({ where:{ key:a.key }, update:{}, create:a })
  }

  // ─── Kurs: O'zbek → Ingliz ─────────────────────
  const uzEn = await prisma.course.upsert({
    where: { fromLanguageId_toLanguageId: { fromLanguageId: uz.id, toLanguageId: en.id } },
    update: {},
    create: { fromLanguageId: uz.id, toLanguageId: en.id },
  })

  const existingUnit = await prisma.unit.findFirst({
    where: { courseId: uzEn.id, order: 1 },
  })
  const unit = existingUnit ?? await prisma.unit.create({
    data: {
      courseId: uzEn.id,
      order: 1,
      title: UZ_EN_BASICS.unitTitle,
      description: 'Common greetings and introductions',
      color: UZ_EN_BASICS.unitColor,
      icon: UZ_EN_BASICS.unitIcon,
    },
  })

  let lessonsCreated = 0
  let exercisesCreated = 0
  let wordsCreated = 0

  for (const lessonSeed of UZ_EN_BASICS.lessons) {
    const existingLesson = await prisma.lesson.findFirst({
      where: { unitId: unit.id, order: lessonSeed.order },
    })

    const lesson = existingLesson ?? await prisma.lesson.create({
      data: {
        unitId: unit.id,
        order: lessonSeed.order,
        type: 'REGULAR',
        xpReward: 10,
      },
    })
    if (!existingLesson) lessonsCreated++

    const linkedExisting = await prisma.lessonExercise.count({ where: { lessonId: lesson.id } })
    if (linkedExisting > 0) continue

    for (let idx = 0; idx < lessonSeed.exercises.length; idx++) {
      const ex = lessonSeed.exercises[idx]

      const exercise = await prisma.exercise.create({
        data: {
          type: ex.type,
          question: ex.question,
          correctAnswer: ex.correctAnswer,
          wrongAnswers: ex.wrongAnswers,
          explanation: ex.explanation,
          difficulty: ex.difficulty ?? 1,
          targetLangCode: en.code,
        },
      })
      exercisesCreated++

      await prisma.lessonExercise.create({
        data: { lessonId: lesson.id, exerciseId: exercise.id, order: idx + 1 },
      })

      for (const w of ex.words ?? []) {
        const word = await prisma.word.upsert({
          where: { id: `${en.code}-${w.text.toLowerCase()}` },
          update: {},
          create: {
            id: `${en.code}-${w.text.toLowerCase()}`,
            languageId: en.id,
            text: w.text,
            translation: w.translation,
            category: w.category ?? 'General',
            level: w.level ?? 'A1',
          },
        })
        wordsCreated++

        await prisma.exerciseWord.upsert({
          where: { exerciseId_wordId: { exerciseId: exercise.id, wordId: word.id } },
          update: {},
          create: { exerciseId: exercise.id, wordId: word.id },
        })
      }
    }
  }

  // Lug'at uchun keng tarqalgan inglizcha so'zlar (250+ ta)
  let extraWords = 0
  for (const w of COMMON_WORDS) {
    await prisma.word.upsert({
      where: { id: `${en.code}-${w.text.toLowerCase()}` },
      update: { translation: w.translation, category: w.category, level: w.level },
      create: {
        id: `${en.code}-${w.text.toLowerCase()}`,
        languageId: en.id,
        text: w.text,
        translation: w.translation,
        category: w.category,
        level: w.level,
      },
    })
    extraWords++
  }

  console.log('✅ Tugadi:', {
    languages: [uz.code, en.code, ru.code],
    leagues: leagues.length,
    achievements: achievements.length,
    courses: 1,
    lessons: lessonsCreated,
    exercises: exercisesCreated,
    wordsFromExercises: wordsCreated,
    commonWords: extraWords,
  })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })