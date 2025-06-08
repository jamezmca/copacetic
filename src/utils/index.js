// import PLAN from './year_plan.json'
import WORDS from './VOCAB.json'
export function countdownIn24Hours(targetUTCMillis) {
    const currentTime = Date.now() // Get current UTC time in milliseconds
    const endOfDay = targetUTCMillis + 24 * 60 * 60 * 1000 // 24 hours after target time

    const remainingTime = endOfDay - currentTime // Calculate how much time is left

    return remainingTime // Positive if time remains, negative if overflowed
}

export function convertMilliseconds(ms) {
    const absTime = Math.abs(ms)
    const hours = Math.floor(absTime / (1000 * 60 * 60))
    const minutes = Math.floor((absTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((absTime % (1000 * 60)) / 1000)

    return {
        hours: ms >= 0 ? hours : -hours,
        minutes: ms >= 0 ? minutes : -minutes,
        seconds: ms >= 0 ? seconds : -seconds
    }
}

function generateWordArr(day, offset = 0) {
    let totalWords = []
    for (let dayIndex in PLAN) {
        if (dayIndex - offset > day) {
            break
        }
        const words = PLAN[dayIndex]
        totalWords = [...totalWords, ...words]
    }
    return totalWords
}

export function calculateNewWords(day) {
    let totalWords = generateWordArr(day)
    const wordSet = new Set(totalWords)
    return wordSet.size
}

export function calculateAccuracy(a, day) {
    let totalWords = generateWordArr(day, -1)
    console.log(a, totalWords)
    return (totalWords.length * 4) / a
}

export function isEncountered(day, word) {
    let totalWords = generateWordArr(day - 1).map(e => getWordByIndex(WORDS, parseInt(e)).word)
    console.log(totalWords)
    return totalWords.includes(word)
}

export function calcLevel(day) {
    let totalWords = generateWordArr(day, -1)
    let d = {}
    for (let word of totalWords) {
        d[word] = (d?.[word] || 0) + 1
    }
    let avgLevel = Object.keys(d).reduce((acc, curr) => {
        return { num: acc.num + 1, total: acc.total + d[curr] }
    }, { total: 0, num: 0 })
    return avgLevel.total / avgLevel.num
}

export function shuffle(arr) {
    let array = [...arr]
    let currentIndex = array.length

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        let randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }
    return array
}

export function getWordByIndex(wordsDict, index) {
    const keys = Object.keys(wordsDict)
    const word = keys[index]
    const definition = wordsDict[word]

    return { word, definition }
}

export function generateDynamicSpacedRepetitionSchedule(
    totalWords,
    maxNewPerDay = 3,
    maxReviewsPerDay = 10
) {
    const intervals = [1, 3, 7, 14, 30, 60, 120, 240]
    const schedule = {}
    let day = 1
    let nextWordIndex = 0
    let learningQueue = []

    const MAX_DAYS = 500

    while (true) {
        if (day > MAX_DAYS) {
            console.warn("Stopped early due to hitting MAX_DAYS")
            break
        }

        const today = []

        // Step 1: Get reviews scheduled for today
        let reviewsToday = learningQueue.filter(entry => entry.nextReview === day)
        let reviewCount = reviewsToday.length

        // Step 2: If no reviews, pull future reviews forward
        if (reviewCount === 0 && learningQueue.length > 0) {
            const futureReviews = learningQueue
                .filter(entry => entry.nextReview > day)
                .sort((a, b) => a.nextReview - b.nextReview)

            const slotsAvailable = maxReviewsPerDay - reviewCount
            const toPull = futureReviews.slice(0, slotsAvailable)

            for (const entry of toPull) {
                entry.nextReview = day // Pull review forward
                reviewsToday.push(entry)
                reviewCount++
            }
        }

        // Step 3: Add reviews to today's list
        for (const entry of reviewsToday) {
            today.push(entry.wordIndex)
        }

        // Step 4: Introduce new words (if review load is low)
        if (reviewCount <= maxReviewsPerDay && nextWordIndex < totalWords) {
            let newWordsToday = 0
            while (
                newWordsToday < maxNewPerDay &&
                nextWordIndex < totalWords &&
                reviewCount < maxReviewsPerDay
            ) {
                const wordIndex = nextWordIndex++
                today.push(wordIndex)
                learningQueue.push({
                    wordIndex,
                    nextReview: day + intervals[0],
                    intervalIndex: 0
                })
                newWordsToday++
                reviewCount++
            }
        }

        // Save today’s schedule (always non-empty now)
        schedule[day] = today

        // Step 5: Advance the learning queue
        learningQueue = learningQueue
            .map(entry => {
                if (entry.nextReview === day) {
                    if (entry.intervalIndex < intervals.length - 1) {
                        return {
                            ...entry,
                            nextReview: day + intervals[entry.intervalIndex + 1],
                            intervalIndex: entry.intervalIndex + 1
                        }
                    } else {
                        return null // Completed final review
                    }
                }
                return entry
            })
            .filter(Boolean)

        // Step 6: Check if we’re done
        if (nextWordIndex >= totalWords && learningQueue.length === 0) {
            break
        }

        day++
    }

    return schedule
}

export const PLAN = generateDynamicSpacedRepetitionSchedule(Object.keys(WORDS).length)
