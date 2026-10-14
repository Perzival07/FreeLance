import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = ({ deliveryFee }) => {

const {currency, delivery_fee: defaultDeliveryFee, getCartAmount} = useContext(ShopContext);
const displayDeliveryFee = deliveryFee !== undefined ? deliveryFee : defaultDeliveryFee;





  return (
    <div className='w-full card-luxury p-6'>
        <div className='text-2xl'>
         <Title text1={'CART'} text2={'TOTALS'}/>
        </div>

        <div className='flex flex-col gap-3 mt-4 text-sm text-ivory-300'>

            <div className='flex justify-between'>
                <p>Total Amount:</p>
                <p>{currency}{getCartAmount()}.00</p>
            </div>

            <div className='divider-gold' />

            <div className='flex justify-between'>
            <p>Shipping Fee:</p>
            <p>{currency}{displayDeliveryFee}.00</p>
            </div>

            <div className='divider-gold' />

            <div className='flex justify-between text-base'>
                <b className='font-display text-lg text-ivory-100'>Total:</b>
                <b className='font-display text-lg text-gold-gradient'>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + displayDeliveryFee } .00</b>
            </div>

        </div>
    </div>
  )
}

export default CartTotal;