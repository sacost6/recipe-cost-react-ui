import Badge from './Badge';
import Button from './Button'
export default function Hero() {
    return(
        <main className='flex-1 flex flex-col items-center justify-center px-4 py-20 text-center relative overflow-hidden'>

            {/* Background Glow */}
            <div className='absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none' />

            {/* Badge */}
            <div className='mb-6'>
                <Badge icon='❖'>
                    Smart Culinary Cost Calculator
                </Badge>
            </div>

            {/* Headline */}
            <h1 className='text-4xl sm:text-6xl font-extrabold tracking-tight text-text' max-w-3xl leading-tight>
                Calculate Every Recipe's <span className='text-primary'>True Cost</span>
            </h1>

            {/* Subtitle */}
            <p className='mt-4 text-base sm:text-lg text-muted max-w-xl'>
                Track ingredient prices, reduce food waste, and maximize your profit margins with real-time cost breakdown.
            </p>

            {/* CTA Buttons */}
            <div className='mt-8 flex flex-col smn:flex-row gap-3 w-full sm:w-auto'>
                <Button to='/recipes' variant='primary'>
                    Create Your First Recipe
                </Button>
                <Button to='/ingredients' variant='secondary'>
                    Manage Ingredients
                </Button>
            </div>
        </main>
    );
}