import {useState} from 'react'

interface FormFieldProps {
    title: string;
    placeholder: string;
    value: string;
    otherStyles?: string;
    handleChangeText: (e: string) => void;
    isPassword?: boolean;
    errors?: any;
}

const TextField: React.FC<FormFieldProps> = ({ title, placeholder, value, handleChangeText, otherStyles, errors = [], isPassword=false, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className={`space-y-2 ${otherStyles}`}>
            <span className='text-base text-gray-800 font-medium'>{title}</span>

            <div className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-[#FFC39E] flex flex-row items-center">
                <input
                className="flex-1 font-semibold text-base"
                value={value}
                onChange={(e) => handleChangeText(e.target.value)}
                placeholder={placeholder}
                {...props}
                />       
                {/* {isPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Image
                        source={!showPassword ? require('@/assets/icons/eye.png') : require('@/assets/icons/eye-hide.png')}
                        className="w-6 h-6"
                        resizeMode="contain"
                        />
                    </TouchableOpacity>
                )} */}
            </div>
            {errors.map((error:string) => {
            return <div key={error} className='text-red-400'>{error}</div>
            })}
        </div>
    )
}

export default TextField