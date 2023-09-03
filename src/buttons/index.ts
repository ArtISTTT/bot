import moment from 'moment';
import { availableTrainers } from './../helpers/availableTrainers';
import { Markup } from "telegraf"

const stringify = (data: any) => {
    return JSON.stringify(data)
}

const byteSize = (str: string) => new Blob([str]).size;

export const buttonsList =  {
    backButton: (type: string, data?: any) => {
        return Markup.button.callback(
            '⬅️ Назад',
            stringify({
                type,
                data
            })
        )
    },
    bookTraining: Markup.button.callback(
        "📝 Записаться на тренировку",
        stringify({
            type: 'bookTraining',
            data: {
                trainerId: 1,
            }
        })
    ),
    rentSki: Markup.button.callback(
        "🎿 Прокат лыж и инвентаря",
        stringify({
            type: 'rentSki',
        })
    ),
    manageBooking: Markup.button.callback(
        "📆 Управление записями",
        stringify({
            type: 'manageBookings',
        })
    ),
    groupTraining: Markup.button.callback(
        "👥 Групповая тренировка",
        stringify({
            type: 'groupTraining',
        }),
    ),
    individualTraining: Markup.button.callback(
        "👤 Индивидуальная тренировка",
        stringify({
            type: 'individualTraining',
        })
    ),
    selectTrainer: (trainerId: number) => {
        return Markup.button.callback(
            availableTrainers.find((trainer) => trainer.id === trainerId)?.name ?? 'Имя не неайдено',
            stringify({
                type: 'informationAboutTrainer',
                data: {
                    trainerId
                }
            })
        )
    },
    selectTrainingDate: (trainerId: number) => {
        return Markup.button.callback(
            '📆 Выбрать дату тренировки',
            stringify({
                type: 'selectTrainingDate',
                data: {
                    trainerId
                }
            })
        )
    },
    selectAnotherTrainer: Markup.button.callback(
        '🔄 Другой тренер',
        stringify({
            type: 'individualTraining',
        })
    ),
    availableDateButton: (date: moment.Moment) => {
        console.log('SIZE:', byteSize(stringify({
            type: 'selectAvailableDate',
            data: {
                date: date.format('YYYY-MM-DD'),
            }
        })))
        return Markup.button.callback(
            date.format('dddd, D MMMM'),
            stringify({
                type: 'selectAvailableDate',
                data: {
                    date: date.format('YYYY-MM-DD'),
                }
            })
        )
    },
    availableTimeButton: (time: number) => {
        return Markup.button.callback(
            `⏰ ${time}:00`,
            stringify({
                type: 'selectAvailableTime',
                data: {
                    time,
                }
            })
        )
    },
    confirmIndividualTraining: Markup.button.callback(
        '✅ Подтвердить запись на тренировку',
        stringify({
            type: 'confirmIndividualTraining',
        })
    ),
    payForIndividualTraining: Markup.button.callback(
        '💳 Оплатить картой',
        stringify({
            type: 'payForIndividualTraining',
        })
    ),
    goToStart: Markup.button.callback(
        '🏠 На главную',
        stringify({
            type: 'goToStart',
        })
    ),
    availableGroupDateButton: (date: moment.Moment) => {
        return Markup.button.callback(
            date.format('dddd, D MMMM'),
            stringify({
                type: 'selectAvailableGroupDate',
                data: {
                    date: date.format('YYYY-MM-DD'),
                }
            })
        )
    },
    availableGroupTimeButton: (time: number, freeNumber: number) => {
        if (freeNumber > 0) {
            return Markup.button.callback(
                `⏰ ${time}:00 (${freeNumber > 0 ? freeNumber + ' свободных мест' : 'Нет свободных мест'}))`,
                stringify({
                    type: 'selectAvailableGroupTime',
                    data: {
                        time,
                    }
                })
            )
        } else {
            return Markup.button.callback(
                `⏰ ${time}:00 (${freeNumber > 0 ? freeNumber + ' свободных мест' : 'Нет свободных мест'}))`,
                stringify({
                    type: 'selectAvailableGroupTimeNotAble',
                    data: {
                        time,
                    }
                })
            )
        }
        
    },
    confirmGroupTraining: Markup.button.callback(
        '✅ Подтвердить запись на групповую тренировку',
        stringify({
            type: 'confirmGroupTraining',
        })
    ),
    payForGroupTraining: Markup.button.callback(
        '💳 Оплатить картой',
        stringify({
            type: 'payForGroupTraining',
        })
    ),
}