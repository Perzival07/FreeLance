import Title from './../components/Title';
import { assets } from './../assets/assets';
import NewsletterBox from './../components/NewsletterBox';

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t hairline-gold'>
        <Title text1={'ABOUT'} text2={'US'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>

        <img className='w-full md:max-w-[450px] card-luxury p-2' src={assets.about_img} alt="about_img" />

        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-ivory-300'>
          <p>Welcome to <strong className="text-ivory-100">Loknath Sofa Center</strong>, your trusted destination for premium quality furniture in Barasat, Kolkata. Since our establishment, we have been dedicated to transforming houses into homes with thoughtfully crafted furniture that blends durability, comfort, and timeless design.</p>

          <p>We take pride in offering a wide range of sofas, beds, tables, chairs, and storage solutions – each piece carefully selected to suit modern Indian lifestyles. Our showroom at Bidhan Park, Barasat, is where quality meets affordability, and every customer is treated like family.</p>

          <b className='font-display text-xl text-gold-gradient'>Our Mission</b>
          <p>To provide beautifully designed, long‑lasting furniture that brings joy and functionality to every home, while ensuring honest pricing, transparent service, and complete customer satisfaction.</p>
        </div>

      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOSE US'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-4'>

        <div className='card-luxury px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:border-gold-400/50 hover:shadow-gold transition-all'>
          <b className='font-display text-lg text-ivory-100 tracking-wide'>Quality Assurance</b>
          <p className='text-ivory-300'>We source only high‑grade materials – solid wood, premium foam, and durable fabric – to ensure every piece lasts for years. Every product is inspected before it reaches your home.</p>
        </div>

        <div className='card-luxury px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:border-gold-400/50 hover:shadow-gold transition-all'>
          <b className='font-display text-lg text-ivory-100 tracking-wide'>Convenience &amp; Customisation</b>
          <p className='text-ivory-300'>Choose from ready‑to‑ship designs or request custom dimensions, colours, and upholstery. We offer free delivery across Barasat and surrounding areas with hassle‑free installation.</p>
        </div>

        <div className='card-luxury px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:border-gold-400/50 hover:shadow-gold transition-all'>
          <b className='font-display text-lg text-ivory-100 tracking-wide'>Exceptional Customer Service</b>
          <p className='text-ivory-300'>Our friendly team guides you from selection to after‑sales support. We’re just a call or message away – because your comfort is our priority.</p>
        </div>

      </div>

      <NewsletterBox/>

    </div>
  )
}

export default About;