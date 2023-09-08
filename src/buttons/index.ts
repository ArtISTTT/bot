import moment from 'moment';
import { availableTrainers } from './../helpers/availableTrainers';
import { Markup } from "telegraf"
import { AvailableSets, RentalPeriod, PreparationType } from '../context.interface';

const stringify = (data: any) => {
    return JSON.stringify(data)
}

const byteSize = (str: string) => new Blob([str]).size;

const equipmentButtons = {
    equipmentRental: Markup.button.callback(
        "🎿 Прокат лыж и инвентаря",
        stringify({
            type: 'equipmentRental',
        }),
    ),
    equipmentPreparation: Markup.button.callback(
        "❄️ Подготовка инвентаря для катания ",
        stringify({
            type: 'equipmentPreparation',
        })
    ),
    rentPrice: Markup.button.callback(
        "💰 Стоимость аренды",
        stringify({
            type: 'rentPrice',
        })
    ),
    rentalPeriod: Markup.button.callback(
        "⏱ Срок аренды",
        stringify({
            type: 'rentalPeriod',
        })
    ),
    knowAboutExistance: Markup.button.callback(
        "📝 Узнать о наличии лыж и инвентаря / Арендовать",
        stringify({
            type: 'knowAboutExistance',
        })
    ),
    justBoots: Markup.button.callback(
        "👟 Только ботинки",
        stringify({
            type: 'selectSet',
            data: {
                set: AvailableSets.justBoots,
            }
        })
    ),
    justSkis: Markup.button.callback(
        "🎿 Только лыжи",
        stringify({
            type: 'selectSet',
            data: {
                set: AvailableSets.justSkis,
            }
        })
    ),
    fullSet: Markup.button.callback(
        "🎿👟 Полный комплект",
        stringify({
            type: 'selectSet',
            data: {
                set: AvailableSets.fullSet,
            }
        })
    ),
    selectRentalPeriod: (text: string, value: RentalPeriod) => {
        return Markup.button.callback(
            text,
            stringify({
                type: 'selectRentalPeriod',
                data: {
                    period: value,
                }
            })
        )
    },
    payForRental: Markup.button.callback(
        "💳 Оплатить аренду",
        stringify({
            type: 'payForRental',
        })
    ),
    skiSharpening: Markup.button.callback(
        "🔪 Заточка лыж",
        stringify({
            type: 'prepCost',
            data: {
                t: PreparationType.skiSharpening,
            }
        })
    ),
    bootMachining: Markup.button.callback(
        "🔧 Обработка ботинок",
        stringify({
            type: 'prepCost',
            data: {
                t: PreparationType.bootMachining,
            }
        })
    ),
    payForPreparation: Markup.button.callback(
        "💳 Оплатить подготовку",
        stringify({
            type: 'payForPreparation',
        })
    ),
}

const manageButtons = {
    checkBookings: Markup.button.callback(
        "📆 Просмотр записей на тренировки",
        stringify({
            type: 'checkBookings',
        })
    ),
    checkRentals: Markup.button.callback(
        "📆 Просмотр арендованого снаряжения",
        stringify({
            type: 'checkRentals',
        })
    ),
    checkPreparations: Markup.button.callback(
        "📆 Просмотр инвентаря на подготовку",
        stringify({
            type: 'checkPreparations',
        })
    )
}

const additional = {
    reviews: Markup.button.callback(
        "📝 Отзывы",
        stringify({
            type: 'reviews',
        })
    ),
    support: Markup.button.callback(
        "📞 Поддержки",
        stringify({
            type: 'support',
        })
    ),
    contacts: Markup.button.callback(
        "📞 Контакты",
        stringify({
            type: 'contacts',
        })
    )
}

export const buttonsList =  {
    ...equipmentButtons,
    ...manageButtons,
    ...additional,
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
            type: 'rentEquipment',
        })
    ),
    manageBooking: Markup.button.callback(
        "📆 Управление записями",
        stringify({
            type: 'manageBookings',
        })
    ),
    additionalInformation: Markup.button.callback(
        "❗ Дополнительно",
        stringify({
            type: 'additionalInformation',
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