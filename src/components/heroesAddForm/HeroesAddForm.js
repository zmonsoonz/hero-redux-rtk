import { Formik, Field, Form, ErrorMessage} from "formik"
import * as Yup from "yup";
import { v4 as uuidv4 } from 'uuid';
import { useCreateHeroMutation, useGetFiltersQuery } from "../../api/apiSlice";

const HeroesAddForm = () => {

    const {
        data: filters = [],
        isLoading : filtersLoading,
        isError
    } = useGetFiltersQuery();

    const [createHero] = useCreateHeroMutation();

    const heroAdd = (values, resetForm) => {
        values.id = uuidv4();
        resetForm();
        createHero(values).unwrap();
    }

    function formOptions(data) {
        if (filtersLoading) {
            return <option>Загрузка элементов</option>
        } else if (isError) {
            return <option>Ошибка загрузки</option>
        }
        if (data && data.length > 0) {
            // eslint-disable-next-line  
            return data.map(({id, element, text}) => {
                if (id !== "all") {
                    return <option key={id} value={element}>{text}</option>;
                }
            })
        }
    }
        
    return (
        <Formik 
        initialValues = {{
            name: '',
            description: '',
            element: ''
        }}
        validationSchema = {Yup.object({
            name: Yup.string()
                    .required('Required field!')
                    .min(2, "Too short name!"),
            description: Yup.string()
                    .required('Required field!')
                    .min(2, "Too short text!"),
            
        })}
        onSubmit = {(values, {resetForm}) => heroAdd(values, resetForm)}>
            <Form className="border p-4 shadow-lg rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                    <Field 
                        type="text" 
                        name="name" 
                        className="form-control" 
                        id="name" 
                        placeholder="Как меня зовут?"/>
                    <ErrorMessage component="div" name="name" className="text-danger"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="text" className="form-label fs-4">Описание</label>
                    <Field as="textarea"
                        name="description" 
                        className="form-control" 
                        id="description" 
                        placeholder="Что я умею?"
                        style={{"height": '130px'}}
                        wrap="hard"/>
                    <ErrorMessage component="div" name="description" className="text-danger"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                    <Field as="select"
                        required
                        className="form-select" 
                        id="element" 
                        name="element">
                        <option disabled value=''>Я владею элементом...</option>
                        {formOptions(filters)}
                    </Field>
                </div>
                <button type="submit" className="btn btn-primary">Создать</button>
            </Form>
        </Formik>
    )
}


export default HeroesAddForm;