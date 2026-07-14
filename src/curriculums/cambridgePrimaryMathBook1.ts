import type { Curriculum, CurriculumUnit } from '../types'

export const CAMBRIDGE_PRIMARY_MATH_BOOK1_ID = 'cambridge-primary-math-book1'

const unit1: CurriculumUnit = {
  id: 'unit_1',
  name: 'Numbers to 10',
  mapLeft: '31.1%',
  mapTop: '21.5%',
  questions: [
    { id: 'u1_q1', prompt: 'How many apples are there?', choices: [1, 2, 3, 4], answer: 2, visualCount: 2 },
    { id: 'u1_q2', prompt: 'How many apples are there?', choices: [3, 4, 5, 6], answer: 5, visualCount: 5 },
    { id: 'u1_q3', prompt: 'How many apples are there?', choices: [5, 6, 7, 8], answer: 7, visualCount: 7 },
    { id: 'u1_q4', prompt: 'How many apples are there?', choices: [1, 2, 3, 4], answer: 1, visualCount: 1 },
    { id: 'u1_q5', prompt: 'How many apples are there?', choices: [7, 8, 9, 10], answer: 9, visualCount: 9 },
    { id: 'u1_q6', prompt: 'How many apples are there?', choices: [1, 2, 3, 4], answer: 3, visualCount: 3 },
    { id: 'u1_q7', prompt: 'How many apples are there?', choices: [7, 8, 9, 10], answer: 10, visualCount: 10 },
    { id: 'u1_q8', prompt: 'How many apples are there?', choices: [4, 5, 6, 7], answer: 6, visualCount: 6 },
    { id: 'u1_q9', prompt: 'How many apples are there?', choices: [2, 3, 4, 5], answer: 4, visualCount: 4 },
    { id: 'u1_q10', prompt: 'How many apples are there?', choices: [6, 7, 8, 9], answer: 8, visualCount: 8 },
  ],
  lessonSlides: [
    { text: "Let's count! We can count from 1 all the way up to 10.", emoji: '🔢' },
    { text: 'Count each apple one at a time: 1, 2, 3... all the way up to 10!', emoji: '🍎' },
  ],
}

const unit2: CurriculumUnit = {
  id: 'unit_2',
  name: 'Working with numbers to 10',
  mapLeft: '11.2%',
  mapTop: '33.5%',
  questions: [
    { id: 'u2_q1', prompt: '2 + 3 = ?', choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u2_q2', prompt: '6 - 2 = ?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u2_q3', prompt: '4 + 4 = ?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u2_q4', prompt: '9 - 5 = ?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u2_q5', prompt: '1 + 6 = ?', choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u2_q6', prompt: '10 - 3 = ?', choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u2_q7', prompt: '3 + 3 = ?', choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u2_q8', prompt: '8 - 6 = ?', choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u2_q9', prompt: '5 + 5 = ?', choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u2_q10', prompt: '7 - 4 = ?', choices: [2, 3, 4, 5], answer: 3 },
  ],
  lessonSlides: [
    { text: 'Adding (+) puts two groups together to make a bigger number.', emoji: '➕' },
    { text: 'Subtracting (-) takes some away, leaving a smaller number.', emoji: '➖' },
    { text: 'All our answers today stay under 10!', emoji: '🔟' },
  ],
}

const unit3: CurriculumUnit = {
  id: 'unit_3',
  name: 'Geometry',
  mapLeft: '23.9%',
  mapTop: '51%',
  questions: [
    { id: 'u3_q1', prompt: 'How many sides does a triangle have?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u3_q2', prompt: 'How many sides does a square have?', choices: [3, 4, 5, 6], answer: 4 },
    { id: 'u3_q3', prompt: 'How many corners does a rectangle have?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u3_q4', prompt: 'How many sides does a pentagon have?', choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u3_q5', prompt: 'How many sides does a hexagon have?', choices: [5, 6, 7, 8], answer: 6 },
    { id: 'u3_q6', prompt: 'How many corners does a triangle have?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u3_q7', prompt: 'How many faces does a cube have?', choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u3_q8', prompt: 'How many corners does a cube have?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u3_q9', prompt: 'How many sides does an octagon have?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u3_q10', prompt: 'How many corners does a square have?', choices: [3, 4, 5, 6], answer: 4 },
  ],
  lessonSlides: [
    {
      text: 'Shapes have sides (the straight lines) and corners (where two sides meet).',
      emoji: '📐',
    },
    { text: 'Triangle = 3 sides. Square and rectangle = 4 sides. Pentagon = 5 sides.', emoji: '🔺' },
    { text: 'Hexagon = 6 sides. Octagon = 8 sides -- like a stop sign!', emoji: '🛑' },
    { text: 'A cube has 6 flat faces and 8 corners.', emoji: '🎲' },
  ],
}

const unit4: CurriculumUnit = {
  id: 'unit_4',
  name: 'Fractions',
  mapLeft: '19.9%',
  mapTop: '74.2%',
  questions: [
    { id: 'u4_q1', prompt: 'What is half of 2?', choices: [1, 2, 3, 4], answer: 1 },
    { id: 'u4_q2', prompt: 'What is half of 4?', choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u4_q3', prompt: 'What is half of 6?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u4_q4', prompt: 'What is half of 8?', choices: [3, 4, 5, 6], answer: 4 },
    { id: 'u4_q5', prompt: 'What is half of 10?', choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u4_q6', prompt: 'What is half of 12?', choices: [5, 6, 7, 8], answer: 6 },
    { id: 'u4_q7', prompt: 'What is half of 14?', choices: [6, 7, 8, 9], answer: 7 },
    { id: 'u4_q8', prompt: 'What is half of 16?', choices: [7, 8, 9, 10], answer: 8 },
    { id: 'u4_q9', prompt: 'What is half of 18?', choices: [8, 9, 10, 11], answer: 9 },
    { id: 'u4_q10', prompt: 'What is half of 20?', choices: [9, 10, 11, 12], answer: 10 },
  ],
  lessonSlides: [
    { text: 'Half means splitting something into 2 equal parts.', emoji: '🍕' },
    { text: 'Half of a number is that number shared evenly between 2 -- half of 10 is 5!', emoji: '🍰' },
  ],
}

const unit5: CurriculumUnit = {
  id: 'unit_5',
  name: 'Measures',
  mapLeft: '38.3%',
  mapTop: '92.5%',
  questions: [
    { id: 'u5_q1', prompt: 'Which is longer: 3 cm or 7 cm? Answer with the number.', choices: [3, 5, 7, 9], answer: 7 },
    { id: 'u5_q2', prompt: 'Which is shorter: 8 cm or 2 cm? Answer with the number.', choices: [2, 4, 6, 8], answer: 2 },
    { id: 'u5_q3', prompt: 'Which is longer: 5 cm or 4 cm? Answer with the number.', choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u5_q4', prompt: 'Which is shorter: 9 cm or 6 cm? Answer with the number.', choices: [6, 7, 8, 9], answer: 6 },
    { id: 'u5_q5', prompt: 'Which is longer: 1 cm or 10 cm? Answer with the number.', choices: [1, 4, 7, 10], answer: 10 },
    { id: 'u5_q6', prompt: 'Which is shorter: 3 cm or 5 cm? Answer with the number.', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u5_q7', prompt: 'Which is longer: 6 cm or 2 cm? Answer with the number.', choices: [2, 4, 6, 8], answer: 6 },
    { id: 'u5_q8', prompt: 'Which is shorter: 7 cm or 4 cm? Answer with the number.', choices: [3, 4, 5, 7], answer: 4 },
    { id: 'u5_q9', prompt: 'Which is longer: 8 cm or 9 cm? Answer with the number.', choices: [6, 7, 8, 9], answer: 9 },
    { id: 'u5_q10', prompt: 'Which is shorter: 2 cm or 6 cm? Answer with the number.', choices: [2, 3, 4, 6], answer: 2 },
  ],
  lessonSlides: [
    { text: 'Length tells us how long or short something is.', emoji: '📏' },
    { text: 'We measure length in centimeters (cm). More cm means longer!', emoji: '📐' },
  ],
}

const unit6: CurriculumUnit = {
  id: 'unit_6',
  name: 'Position',
  mapLeft: '51.8%',
  mapTop: '75.8%',
  questions: [
    { id: 'u6_q1', prompt: "What number position is 'first'?", choices: [1, 2, 3, 4], answer: 1 },
    { id: 'u6_q2', prompt: "What number position is 'third'?", choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u6_q3', prompt: "What number position is 'fifth'?", choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u6_q4', prompt: "What number position is 'second'?", choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u6_q5', prompt: "What number position is 'fourth'?", choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u6_q6', prompt: "What number position is 'sixth'?", choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u6_q7', prompt: "What number position is 'seventh'?", choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u6_q8', prompt: "What number position is 'eighth'?", choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u6_q9', prompt: "What number position is 'ninth'?", choices: [7, 8, 9, 10], answer: 9 },
    { id: 'u6_q10', prompt: "What number position is 'tenth'?", choices: [7, 8, 9, 10], answer: 10 },
  ],
  lessonSlides: [
    { text: 'Ordinal words tell us the order of things in a line.', emoji: '🥇' },
    { text: '1st = first, 2nd = second, 3rd = third... all the way to 10th!', emoji: '🏁' },
  ],
}

const unit7: CurriculumUnit = {
  id: 'unit_7',
  name: 'Time',
  mapLeft: '51.8%',
  mapTop: '55.8%',
  questions: [
    { id: 'u7_q1', prompt: "The clock shows 3 o'clock. What is the hour?", choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u7_q2', prompt: "The clock shows 7 o'clock. What is the hour?", choices: [6, 7, 8, 9], answer: 7 },
    { id: 'u7_q3', prompt: "The clock shows 1 o'clock. What is the hour?", choices: [1, 2, 3, 4], answer: 1 },
    { id: 'u7_q4', prompt: "The clock shows 10 o'clock. What is the hour?", choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u7_q5', prompt: "How many hours are between 2 o'clock and 5 o'clock?", choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u7_q6', prompt: "How many hours are between 1 o'clock and 6 o'clock?", choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u7_q7', prompt: "The clock shows 12 o'clock. What is the hour?", choices: [10, 11, 12, 1], answer: 12 },
    { id: 'u7_q8', prompt: "How many hours are between 3 o'clock and 8 o'clock?", choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u7_q9', prompt: "The clock shows 9 o'clock. What is the hour?", choices: [7, 8, 9, 10], answer: 9 },
    { id: 'u7_q10', prompt: "How many hours are between 6 o'clock and 9 o'clock?", choices: [2, 3, 4, 5], answer: 3 },
  ],
  lessonSlides: [
    { text: 'A clock has a short hand and a long hand.', emoji: '🕐' },
    { text: 'The short hand points to the hour.', emoji: '🕑' },
    {
      text: "'3 o'clock' means the short hand points at 3, and the long hand points straight up at 12.",
      emoji: '🕒',
    },
  ],
}

const unit8: CurriculumUnit = {
  id: 'unit_8',
  name: 'Statistics',
  mapLeft: '49.4%',
  mapTop: '33.5%',
  questions: [
    { id: 'u8_q1', prompt: 'Circle A has 3 items and circle B has 2 items with no overlap. How many items in total?', choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u8_q2', prompt: 'A set has 4 red apples and 3 green apples. How many apples in total?', choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u8_q3', prompt: 'A Venn diagram has 2 in circle A only, 3 in circle B only, and 1 in both. How many in circle A total?', choices: [1, 2, 3, 4], answer: 3 },
    { id: 'u8_q4', prompt: 'A Venn diagram has 2 in circle A only, 3 in circle B only, and 1 in both. How many in circle B total?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u8_q5', prompt: 'A set of shapes has 6 circles and 2 squares. How many shapes in total?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u8_q6', prompt: 'A set has 5 toys, and 2 are removed. How many toys are left?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u8_q7', prompt: 'A Venn diagram has 4 in circle A only and 3 in both. How many are in circle A total?', choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u8_q8', prompt: 'A set has 10 stickers and 4 are given away. How many stickers are left?', choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u8_q9', prompt: 'A group has 3 boys and 5 girls. How many children in total?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u8_q10', prompt: 'A set has 9 fruits and 3 are apples. How many are not apples?', choices: [4, 5, 6, 7], answer: 6 },
  ],
  lessonSlides: [
    { text: 'A group of things is called a set.', emoji: '🧺' },
    { text: 'We can put two sets together to find a total.', emoji: '➕' },
    { text: 'A Venn diagram shows when some items belong to both sets!', emoji: '🔵' },
  ],
}

const unit9: CurriculumUnit = {
  id: 'unit_9',
  name: 'Numbers to 20',
  mapLeft: '51.8%',
  mapTop: '15.2%',
  questions: [
    { id: 'u9_q1', prompt: 'How many apples are there?', choices: [10, 11, 12, 13], answer: 12, visualCount: 12 },
    { id: 'u9_q2', prompt: 'How many apples are there?', choices: [13, 14, 15, 16], answer: 15, visualCount: 15 },
    { id: 'u9_q3', prompt: 'How many apples are there?', choices: [9, 10, 11, 12], answer: 11, visualCount: 11 },
    { id: 'u9_q4', prompt: 'How many apples are there?', choices: [16, 17, 18, 19], answer: 18, visualCount: 18 },
    { id: 'u9_q5', prompt: 'How many apples are there?', choices: [12, 13, 14, 15], answer: 14, visualCount: 14 },
    { id: 'u9_q6', prompt: 'How many apples are there?', choices: [17, 18, 19, 20], answer: 20, visualCount: 20 },
    { id: 'u9_q7', prompt: 'How many apples are there?', choices: [11, 12, 13, 14], answer: 13, visualCount: 13 },
    { id: 'u9_q8', prompt: 'How many apples are there?', choices: [15, 16, 17, 18], answer: 17, visualCount: 17 },
    { id: 'u9_q9', prompt: 'How many apples are there?', choices: [14, 15, 16, 17], answer: 16, visualCount: 16 },
    { id: 'u9_q10', prompt: 'How many apples are there?', choices: [17, 18, 19, 20], answer: 19, visualCount: 19 },
  ],
  lessonSlides: [
    { text: "Now let's count past 10!", emoji: '🔢' },
    { text: '11, 12, 13... all the way up to 20.', emoji: '2️⃣0️⃣' },
  ],
}

const unit10: CurriculumUnit = {
  id: 'unit_10',
  name: 'Working with numbers to 20',
  mapLeft: '75.8%',
  mapTop: '22.3%',
  questions: [
    { id: 'u10_q1', prompt: '12 + 3 = ?', choices: [13, 14, 15, 16], answer: 15 },
    { id: 'u10_q2', prompt: '18 - 5 = ?', choices: [11, 12, 13, 14], answer: 13 },
    { id: 'u10_q3', prompt: '9 + 8 = ?', choices: [15, 16, 17, 18], answer: 17 },
    { id: 'u10_q4', prompt: '20 - 6 = ?', choices: [12, 13, 14, 15], answer: 14 },
    { id: 'u10_q5', prompt: '11 + 7 = ?', choices: [16, 17, 18, 19], answer: 18 },
    { id: 'u10_q6', prompt: '19 - 9 = ?', choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u10_q7', prompt: '6 + 9 = ?', choices: [13, 14, 15, 16], answer: 15 },
    { id: 'u10_q8', prompt: '16 - 4 = ?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u10_q9', prompt: '10 + 10 = ?', choices: [18, 19, 20, 21], answer: 20 },
    { id: 'u10_q10', prompt: '17 - 8 = ?', choices: [7, 8, 9, 10], answer: 9 },
  ],
  lessonSlides: [
    { text: 'We add and subtract just like before...', emoji: '➕' },
    { text: '...but now with numbers all the way up to 20!', emoji: '2️⃣0️⃣' },
  ],
}

const unit11: CurriculumUnit = {
  id: 'unit_11',
  name: 'Geometry (2)',
  mapLeft: '90.1%',
  mapTop: '10.4%',
  questions: [
    { id: 'u11_q1', prompt: 'How many faces does a rectangular box (cuboid) have?', choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u11_q2', prompt: 'How many edges does a cube have?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u11_q3', prompt: 'How many faces does a triangular pyramid have?', choices: [3, 4, 5, 6], answer: 4 },
    { id: 'u11_q4', prompt: 'How many corners does a pentagon have?', choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u11_q5', prompt: 'How many sides does a heptagon have?', choices: [6, 7, 8, 9], answer: 7 },
    { id: 'u11_q6', prompt: 'How many flat faces does a cylinder have?', choices: [0, 1, 2, 3], answer: 2 },
    { id: 'u11_q7', prompt: 'How many corners does a hexagon have?', choices: [5, 6, 7, 8], answer: 6 },
    { id: 'u11_q8', prompt: 'How many flat faces does a cone have?', choices: [0, 1, 2, 3], answer: 1 },
    { id: 'u11_q9', prompt: 'How many corners does an octagon have?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u11_q10', prompt: 'How many edges does a triangle have?', choices: [2, 3, 4, 5], answer: 3 },
  ],
  lessonSlides: [
    {
      text: '3D shapes have faces (flat surfaces), edges (where 2 faces meet), and corners.',
      emoji: '🎲',
    },
    { text: 'A cube has 6 faces and 12 edges.', emoji: '🎲' },
    { text: 'A cone has 1 flat face. A cylinder has 2 flat faces.', emoji: '🍦' },
    { text: 'A heptagon has 7 sides. A hexagon has 6 corners. An octagon has 8 corners.', emoji: '⚽' },
  ],
}

const unit12: CurriculumUnit = {
  id: 'unit_12',
  name: 'Fractions (2)',
  mapLeft: '74.2%',
  mapTop: '40.7%',
  questions: [
    { id: 'u12_q1', prompt: 'What is half of 22?', choices: [10, 11, 12, 13], answer: 11 },
    { id: 'u12_q2', prompt: 'What is half of 24?', choices: [11, 12, 13, 14], answer: 12 },
    { id: 'u12_q3', prompt: 'What is half of 26?', choices: [12, 13, 14, 15], answer: 13 },
    { id: 'u12_q4', prompt: 'What is half of 28?', choices: [13, 14, 15, 16], answer: 14 },
    { id: 'u12_q5', prompt: 'What is half of 30?', choices: [14, 15, 16, 17], answer: 15 },
    { id: 'u12_q6', prompt: 'What is half of 16?', choices: [7, 8, 9, 10], answer: 8 },
    { id: 'u12_q7', prompt: 'What is half of 18?', choices: [8, 9, 10, 11], answer: 9 },
    { id: 'u12_q8', prompt: 'What is half of 20?', choices: [9, 10, 11, 12], answer: 10 },
    { id: 'u12_q9', prompt: 'What is half of 32?', choices: [15, 16, 17, 18], answer: 16 },
    { id: 'u12_q10', prompt: 'What is half of 34?', choices: [16, 17, 18, 19], answer: 17 },
  ],
  lessonSlides: [
    { text: 'Half still means splitting into 2 equal parts.', emoji: '🍕' },
    { text: 'Now with bigger numbers -- half of 30 is 15!', emoji: '🍰' },
  ],
}

const unit13: CurriculumUnit = {
  id: 'unit_13',
  name: 'Measures (2)',
  mapLeft: '82.1%',
  mapTop: '47.1%',
  questions: [
    { id: 'u13_q1', prompt: 'Which is heavier: 2 kg or 8 kg? Answer with the number.', choices: [2, 4, 6, 8], answer: 8 },
    { id: 'u13_q2', prompt: 'Which is lighter: 5 kg or 3 kg? Answer with the number.', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u13_q3', prompt: 'Which holds more: 4 litres or 9 litres? Answer with the number.', choices: [4, 6, 7, 9], answer: 9 },
    { id: 'u13_q4', prompt: 'Which holds less: 6 litres or 2 litres? Answer with the number.', choices: [1, 2, 3, 6], answer: 2 },
    { id: 'u13_q5', prompt: 'Which is heavier: 7 kg or 1 kg? Answer with the number.', choices: [1, 3, 5, 7], answer: 7 },
    { id: 'u13_q6', prompt: 'Which is lighter: 9 kg or 4 kg? Answer with the number.', choices: [3, 4, 5, 9], answer: 4 },
    { id: 'u13_q7', prompt: 'Which holds more: 3 litres or 10 litres? Answer with the number.', choices: [3, 5, 7, 10], answer: 10 },
    { id: 'u13_q8', prompt: 'Which holds less: 8 litres or 5 litres? Answer with the number.', choices: [4, 5, 6, 8], answer: 5 },
    { id: 'u13_q9', prompt: 'Which is heavier: 6 kg or 2 kg? Answer with the number.', choices: [2, 3, 4, 6], answer: 6 },
    { id: 'u13_q10', prompt: 'Which is lighter: 7 kg or 5 kg? Answer with the number.', choices: [4, 5, 6, 7], answer: 5 },
  ],
  lessonSlides: [
    {
      text: 'Weight tells us how heavy something is, measured in kilograms (kg). Heavier means more kg.',
      emoji: '⚖️',
    },
    {
      text: 'Capacity tells us how much a container holds, measured in litres. Holds more means more litres.',
      emoji: '🥤',
    },
  ],
}

const unit14: CurriculumUnit = {
  id: 'unit_14',
  name: 'Position, direction and patterns',
  mapLeft: '79.7%',
  mapTop: '57.4%',
  questions: [
    { id: 'u14_q1', prompt: 'What number comes next: 2, 4, 6, 8, ?', choices: [9, 10, 11, 12], answer: 10 },
    { id: 'u14_q2', prompt: 'What number comes next: 1, 3, 5, 7, ?', choices: [8, 9, 10, 11], answer: 9 },
    { id: 'u14_q3', prompt: 'What number comes next: 5, 10, 15, 20, ?', choices: [22, 24, 25, 30], answer: 25 },
    { id: 'u14_q4', prompt: 'What number comes next: 10, 8, 6, 4, ?', choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u14_q5', prompt: 'What number comes next: 3, 6, 9, 12, ?', choices: [13, 14, 15, 16], answer: 15 },
    { id: 'u14_q6', prompt: 'What number comes next: 20, 18, 16, 14, ?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u14_q7', prompt: 'What number comes next: 0, 2, 4, 6, ?', choices: [7, 8, 9, 10], answer: 8 },
    { id: 'u14_q8', prompt: 'What number comes next: 4, 8, 12, 16, ?', choices: [18, 19, 20, 21], answer: 20 },
    { id: 'u14_q9', prompt: 'What number comes next: 15, 12, 9, 6, ?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u14_q10', prompt: 'What number comes next: 1, 4, 7, 10, ?', choices: [11, 12, 13, 14], answer: 13 },
  ],
  lessonSlides: [
    { text: 'A pattern is a sequence that changes the same way every time.', emoji: '🔁' },
    {
      text: 'Adding 2 each time: 2, 4, 6, 8... Subtracting 2 each time: 10, 8, 6, 4...',
      emoji: '🔢',
    },
    { text: 'Look at what changes between each number to find what comes next!', emoji: '🔍' },
  ],
}

const unit15: CurriculumUnit = {
  id: 'unit_15',
  name: 'Time (2)',
  mapLeft: '93.3%',
  mapTop: '63.8%',
  questions: [
    { id: 'u15_q1', prompt: 'How many minutes are in half an hour?', choices: [15, 20, 30, 45], answer: 30 },
    { id: 'u15_q2', prompt: 'How many minutes are in a full hour?', choices: [30, 45, 60, 90], answer: 60 },
    { id: 'u15_q3', prompt: 'The clock shows half past 3. What is the hour number?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u15_q4', prompt: 'How many minutes are in a quarter of an hour?', choices: [10, 15, 20, 25], answer: 15 },
    { id: 'u15_q5', prompt: 'The clock shows half past 7. What is the hour number?', choices: [6, 7, 8, 9], answer: 7 },
    { id: 'u15_q6', prompt: 'How many half-hours are in 2 hours?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u15_q7', prompt: 'The clock shows half past 9. What is the hour number?', choices: [8, 9, 10, 11], answer: 9 },
    { id: 'u15_q8', prompt: 'How many minutes are in 2 hours?', choices: [90, 100, 110, 120], answer: 120 },
    { id: 'u15_q9', prompt: 'The clock shows half past 11. What is the hour number?', choices: [9, 10, 11, 12], answer: 11 },
    { id: 'u15_q10', prompt: 'How many quarter-hours are in 1 hour?', choices: [2, 3, 4, 5], answer: 4 },
  ],
  lessonSlides: [
    { text: "'Half past' means 30 minutes after the hour.", emoji: '🕜' },
    {
      text: 'A full hour is 60 minutes, half an hour is 30 minutes, and a quarter hour is 15 minutes.',
      emoji: '⏰',
    },
  ],
}

const unit16: CurriculumUnit = {
  id: 'unit_16',
  name: 'Statistics (2)',
  mapLeft: '86.1%',
  mapTop: '79.7%',
  questions: [
    { id: 'u16_q1', prompt: 'A block graph shows 4 blocks for apples and 6 for bananas. How many more bananas than apples?', choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u16_q2', prompt: 'A tally shows 5 marks for cats and 3 for dogs. How many pets in total?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u16_q3', prompt: 'A block graph shows 7 blocks for red and 2 for blue. How many more red than blue?', choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u16_q4', prompt: 'A table shows 3 rows with 4 items each. How many items in total?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u16_q5', prompt: 'A tally shows 6 marks for sunny days and 4 for rainy days. How many days in total?', choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u16_q6', prompt: 'A block graph shows 5 blocks for football and 8 for swimming. How many more swimming than football?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u16_q7', prompt: 'A table shows 2 rows with 6 items each. How many items in total?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u16_q8', prompt: 'A tally shows 9 marks for pens and 5 for pencils. How many more pens than pencils?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u16_q9', prompt: 'A block graph shows 3 blocks for yellow and 7 for green. How many blocks in total?', choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u16_q10', prompt: 'A table shows 4 rows with 5 items each. How many items in total?', choices: [18, 19, 20, 21], answer: 20 },
  ],
  lessonSlides: [
    { text: 'A tally mark or a block in a graph stands for one item counted.', emoji: '📊' },
    {
      text: 'Add up blocks or tallies for a total, or compare two bars to see which has more.',
      emoji: '📈',
    },
  ],
}

export const CAMBRIDGE_PRIMARY_MATH_BOOK1: Curriculum = {
  id: CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
  name: 'Cambridge Primary Mathematics Book 1',
  units: [
    unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8,
    unit9, unit10, unit11, unit12, unit13, unit14, unit15, unit16,
  ],
}

export function getUnitById(
  curriculum: Curriculum,
  unitId: string,
): CurriculumUnit | undefined {
  return curriculum.units.find((unit) => unit.id === unitId)
}

export function getNextUnitId(
  curriculum: Curriculum,
  currentUnitId: string,
): string | null {
  const currentIndex = curriculum.units.findIndex((unit) => unit.id === currentUnitId)

  if (currentIndex === -1 || currentIndex === curriculum.units.length - 1) {
    return null
  }

  return curriculum.units[currentIndex + 1].id
}
