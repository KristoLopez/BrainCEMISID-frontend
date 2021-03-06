import {
    SIGN_IN_USER, SET_PROJECT_SUMMARY, SET_CARDS, SET_SNB, RECOGNITION_SUCCESS, SET_DESIRED_STATE, SET_ADJUSTED_CARDS, ADJUST_CARD_ATTEMPT, ADJUST_CARD_SUCCESS, ADJUST_CARD_FAILURE, PROJECT_CREATION_ATTEMPT, PROJECT_CREATION_FAILURE, PROJECT_CREATION_SUCCESS
} from '../types.js'
import {n1, n2, n3, n4, n5, n6, n7, n8, n9, n0} from '../../Components/PreloadedCardImages'


const initialState = {
    cards: [
        // {
        //     image: n1,
        //     class: 'dígito',
        //     name: '1',
        //     id: -2,
        // },
        // {
        //     image: n2,
        //     class: 'dígito',
        //     name: '2',
        //     id: -3,
        // },
        // {
        //     image: n3,
        //     class: 'dígito',
        //     name: '3',
        //     id: -4,
        // },
        // {
        //     image: n4,
        //     class: 'dígito',
        //     name: '4',
        //     id: -5,
        // },
        // {
        //     image: n5,
        //     class: 'dígito',
        //     name: '5',
        //     id: -6,
        // },
        // {
        //     image: n6,
        //     class: 'dígito',
        //     name: '6',
        //     id: -7,
        // },
        // {
        //     image: n7,
        //     class: 'dígito',
        //     name: '7',
        //     id: -8,
        // },
        // {
        //     image: n8,
        //     class: 'dígito',
        //     name: '8',
        //     id: -9,
        // },
        // {
        //     image: n9,
        //     class: 'dígito',
        //     name: '9',
        //     id: -10,
        // },
        // {
        //     image: n0,
        //     class: 'dígito',
        //     name: '0',
        //     id: -11,
        // },
    ],
    projectId: -1,
    projectName: '',
    internalState: {
        biology: 0,
        culture: 0,
        feelings: 0,
    },
    desiredState: {
        biology: 0,
        culture: 0,
        feelings: 0,
    },
    loadingCards: false,
    snbHearing: [],
    snbSight: [],
    relNetwork: [],
    episodicMemory: [],
    adjustedCards: [],
    adjustCardStatus: 'none',
    creationProjectStatus: 'none'
}

const ProjectReducer = (state = initialState, action) =>{
    let newState = {...state}
    switch(action.type){
        case SET_PROJECT_SUMMARY:
            newState.projectId = action.payload.id;
            newState.internalState = action.payload.internal_state
            newState.desiredState = action.payload.desired_state
            newState.projectName = action.payload.name
            return newState
        case SET_CARDS:
            let cardArray = [];
            action.payload.cards.forEach(c=>{
                cardArray.push({
                    image: c.img,
                    name: c.name,
                    class: c.name_class,
                    id: c.id
                })
            })
            if(action.payload.append)
                newState.cards = newState.cards.concat(cardArray);
            else
                newState.cards = initialState.cards.concat(cardArray);
            newState.loadingCards = false;
            return newState;
        case SET_SNB:
            console.log(action.payload)
            newState.snbHearing = action.payload.hearing;
            newState.snbSight = action.payload.sight;
            newState.relNetwork = action.payload.relational;
            newState.episodicMemory = action.payload.episodes;
            return newState;
        case RECOGNITION_SUCCESS:
            if(action.payload !== null)
            newState.internalState = {biology: action.payload.biology, culture: action.payload.culture, feelings: action.payload.feelings}
            return newState;
        case SET_DESIRED_STATE:
            newState.desiredState = action.payload;
            return newState;
        case SET_ADJUSTED_CARDS:
            newState.adjustedCards = action.payload;
            return newState
        case ADJUST_CARD_ATTEMPT:
            newState.adjustCardStatus = 'loading'
            return newState
        case ADJUST_CARD_SUCCESS:
            newState.adjustCardStatus = 'success'
            return newState
        case ADJUST_CARD_FAILURE:
            newState.adjustCardStatus = 'failure'
            return newState
        case PROJECT_CREATION_ATTEMPT:
            newState.creationProjectStatus = 'loading'
            return newState
        case PROJECT_CREATION_SUCCESS:
            newState.creationProjectStatus = 'success'
            return newState
        case PROJECT_CREATION_FAILURE:
            newState.creationProjectStatus = 'failure'
            return newState
        default:
            return newState
    }
}

export default ProjectReducer