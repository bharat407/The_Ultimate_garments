const initialState = {
    cart: {},   //it is a reducer(json) 
    user: {}
};

export default function RootReducer(state = initialState, action) //action Contain type and payload 
{
    switch (action.type) {
        case 'ADD_CART':

            state.cart[action.payload[0]] = action.payload[1]
            console.log("Redux:", state.cart)
            return { cart: state.cart, user: state.user }
        case 'DELETE_CART':

            delete state.cart[action.payload[0]]
            return { cart: state.cart, user: state.user }
        case 'EMPTY_CART':

            state.cart = {}
            return { cart: state.cart, user: state.user }

        case 'ADD_USER':

            state.user[action.payload[0]] = action.payload[1]
            console.log("Redux User:", state.user)
            return { cart: state.cart, user: state.user }
        case 'DELETE_USER':

            state.user={}
            console.log("Redux User:", state.user)
            return { cart: state.cart, user: state.user }

        default:
            return state;
    }

}
