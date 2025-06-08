import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react';
import * as XLSX from 'xlsx'
import userImage from '../image/user.jpg'

function FirstPage() {

    const statusTypes = [
        {
            title: 'درحال ارسال ...',
            status: 'loading'
        },
        {
            title: 'خطا در ارسال',
            status: 'error'
        },
        {
            title: 'ارسال شد!',
            status: 'success'
        },
        {
            title: 'تایید',
            status: 'none'
        },
    ]

    const [status, setStatus] = useState('none')

    const [userProfileData, setUserProfileData] = useState({
        name: '',
        email: '',
        profileImage: userImage,
        excelFile: []
    })

    // محدودیت کاراکتر های ورودی اینپوت . برای نام فقط حروف فارسی و برای ایمیل فقط حروف انگلیسی و عدد
    const nameRegex = /^[آ-ی\s]+$/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    const schema = yup.object().shape({
        name: yup.string().min(3, 'نام حداقل سه حرف باید باشد')
            .matches(nameRegex, 'فقط حروف فارسی مجازه').required('نام خود را وارد کنید'),

        email: yup.string().email('ایمیل اشتباه است')
            .matches(emailRegex, 'ایمیل را درست وارد کنید (کاراکتر های خاص و فارسی نباشن)')
            .required('ایمیل خود را وارد کنید'),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

    const onFormSubmit = async () => {
        setStatus('loading')
        try {
            await fetch("http://localhost:3010/user", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userProfileData)
            })
            setStatus('success')
        } catch (err) {
            setStatus('error')
        }
        console.log('submited');
    }


    const onImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            const image = URL.createObjectURL(event.target.files[0])
            setUserProfileData(prev => ({ ...prev, profileImage: image }))
        }
    }

    // تبدیل فایل اکسل به جیسون
    const handleFile = (e: any) => {
        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName]
            const parsedData: any = XLSX.utils.sheet_to_json(sheet)
            setUserProfileData(prev => ({ ...prev, excelFile: parsedData }))
        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className='flexDiv'>
                    <img src={userProfileData.profileImage} className='profileImage' />
                    <input type='file' onChange={onImageChange} id='profileinput' accept='image/*' />
                </div>

                <div>
                    <input type="text" {...register("name")}
                        onChange={(e) => setUserProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                    {
                        errors.name && (
                            <p className='error-msg'>{errors.name?.message}</p>
                        )
                    }
                </div>

                <div>
                    {/* تایپ را ایمیل نزاشتم تا ارور فارسی نمایش بده */}
                    <input type="text" {...register("email")}
                        onChange={(e) => setUserProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                    {
                        errors.email && (
                            <p className='error-msg'>{errors.email?.message}</p>
                        )
                    }
                </div>

                <div>
                    <h4>فایل اکسل (اختیاری)</h4>
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFile}
                    />
                </div>

                <button type='submit' className='greenbtn'>
                    {
                        statusTypes.find(item => item.status === status)?.title
                    }
                </button>
            </form>
        </div>
    )
}

export default FirstPage