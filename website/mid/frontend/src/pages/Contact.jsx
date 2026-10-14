import Title from './../components/Title';
import { assets } from './../assets/assets';
import NewsletterBox from './../components/NewsletterBox';

const Contact = () => {
  return (
    <div>

      <div className="text-center text-2xl pt-10 border-t hairline-gold">
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px] card-luxury p-2' src={assets.contact_img} alt="contact_img" />

        <div className='flex flex-col justify-center items-start gap-6 card-luxury p-8'>
          <p className='eyebrow-gold text-xs'>VISIT US</p>
          <p className='font-display text-2xl text-ivory-100'>Our Store</p>
          <p className='text-ivory-400'>
            Bidhan Park, Barasat<br />
            Kolkata – 700124, West Bengal
          </p>
          <p className='text-ivory-400'>
            Tel: <a href="tel:+919123924645" className="hover:text-gold-400 transition-colors">+91 91239 24645</a><br />
            Email: <a href="mailto:loknathsofacenter@gmail.com" className="hover:text-gold-400 transition-colors">loknathsofacenter@gmail.com</a>
          </p>
          <div className='divider-gold w-full' />
          <p className='font-display text-2xl text-ivory-100'>Opening Hours</p>
          <p className='text-ivory-400'>
            Mon – Sun: 10:00 AM – 8:00 PM<br />
            (Thursday: 11:00 AM – 5:00 PM)
          </p>
          <a
            href="https://www.google.com/maps/place/Loknath+Sofa+Center/@22.7179621,88.4911163,19.6z/data=!4m6!3m5!1s0x39f8a300549ab59f:0xcaabd02a4a58e490!8m2!3d22.7180601!4d88.4907312!16s%2Fg%2F11vzy_2ywh?entry=ttu&g_ep=EgoyMDI2MDQxNC4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className='btn-gold-outline'
          >
            Get Directions
          </a>
        </div>

      </div>

      <NewsletterBox/>

    </div>
  )
}

export default Contact;