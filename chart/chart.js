const QuickChart = require('quickchart-js')

const { getLastSleepTimeForDays, getLastWakeUpTimeForDays } = require('../db/time')
const { sendPhotoToVKUser } = require('../vk/vkapi')

const to2DigitFixed = number => Number(number.toFixed(2))

const getNormalTime = decTime => {
    const time = decTime.y
    const decMinutes = (time * 100) % 100
    let minutes = Math.round((decMinutes * 60) / 100)
    minutes = minutes < 10 ? `0${minutes}` : minutes

    const hours = Math.floor(time) % 24

    return `${hours}:${minutes}`
}

const getLabels = (sleepLabels, wakeUpLabels) => {
    const dates = [...sleepLabels, ...wakeUpLabels]
    const minDate = new Date(Math.min.apply(null, dates))
    const maxDate = new Date(Math.max.apply(null, dates))

    return [minDate, maxDate]
}

const getData = (labels, sleepDataset, wakeUpDataset) => ({
    labels,
    datasets: [
        {
            label: 'Укладывания',
            data: sleepDataset,
            fill: false,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
        },
        {
            label: 'Подъёмы',
            data: wakeUpDataset,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
        }
    ],
})

const getOptions = () => ({
    title: {
        display: true,
        text: 'Диаграмма режима',
    },
    scales: {
        xAxes: [{
            type: 'time',
            distribution: 'series',
            time: {
                unit: 'day',
                isoWeekday: true,
                round: true,
            },
            bounds: 'data',
            ticks: {
                source: 'auto'
            }
        }],
        yAxes: [{
            ticks: {
                min: 0,
                stepSize: 1,
                callback: val => val % 24
            }
        }]
    },
    plugins: {
        // datalabels: {
        //     anchor: 'start',
        //     align: 'bottom',
        //     color: '#fff',
        //     backgroundColor: 'rgba(34, 139, 34, 0.6)',
        //     borderColor: 'rgba(34, 139, 34, 1.0)',
        //     borderWidth: 1,
        //     borderRadius: 5,
        //     formatter: getNormalTime
        // },
    }
})

const getTimeInDecFormat = (hours, minutes) => {
    const adaptedHours = hours <= 4 ? 24 + hours : hours
    const decMinutes = to2DigitFixed(minutes / 60)

    return adaptedHours + decMinutes
}

const getDatasetForDates = dates => dates
    .map(date => {
        const hours = date.getHours()
        const minutes = date.getMinutes()
        const datasetDate = new Date(date)
        datasetDate.setHours(0, 0, 0, 0)

        return {
            t: datasetDate,
            y: getTimeInDecFormat(hours, minutes),
        }
    })

const createChart = async (userID, atPath, forDays) => {
    try {
        const sleepDates = await getLastSleepTimeForDays(userID, forDays)
        const wakeUpDates = await getLastWakeUpTimeForDays(userID, forDays)

        const labels = getLabels(sleepDates, wakeUpDates)
        const sleepDataset = getDatasetForDates(sleepDates)
        const wakeUpDataset = getDatasetForDates(wakeUpDates)

        const data = getData(labels, sleepDataset, wakeUpDataset)
        const options = getOptions()

        const myChart = new QuickChart()

        myChart.setConfig({
            type: 'line',
            data,
            options,
        })
        await myChart.toFile(atPath)
    } catch (err) {
        console.error(err)
    }
}

const sendChart = async userID => {
    const pathToChartSave = `/tmp/chart_${userID}.png`
    const forDays = 30

    try {
        await createChart(userID, pathToChartSave, forDays)
        sendPhotoToVKUser(userID, pathToChartSave)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    sendChart,
}
