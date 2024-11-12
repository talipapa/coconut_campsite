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
        <div className={`space-y-2 w-full ${otherStyles}`}>
            <div className='flex flex-row items-end space-x-4'>
                <span className='text-base text-gray-800 font-medium text-center'>{title}</span>
                {errors.map((error:string) => {
                    return <div key={error} className='text-red-600'>{error}</div>
                })}
            </div>

            <div className="w-full bg-black-100 rounded-2xl flex flex-row items-center">
                <input
                className="flex-1 font-semibold text-base border-2 rounded-md border-black-200 px-4 py-4"
                value={value}
                type={isPassword ? 'password' : 'text'}
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

        </div>
    )
}

export default TextField