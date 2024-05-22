import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';
import { CSSTransition, TransitionGroup} from 'react-transition-group';
import './heroesList.scss';
import { useGetHeroesQuery, useDeleteHeroMutation } from '../../api/apiSlice';

const HeroesList = () => {

    const {
        data: heroes = [],
        isLoading,
        isError,
    } = useGetHeroesQuery();

    const activeFilter = useSelector(state => state.filters.currentAction)
    const [deleteHero] = useDeleteHeroMutation();
    const filterHeroes = useMemo(() => {
        const filterHeroes = heroes.slice();
        if (activeFilter === "all") {
            return filterHeroes
        }
        else {
            return filterHeroes.filter(item => item.element === activeFilter)
        }
    }, [heroes, activeFilter]);

    const onDelete = useCallback((id) => {
        deleteHero(id)
        // eslint-disable-next-line  
    }, []);

    if (isLoading) {
        return <Spinner/>;
    } else if (isError) {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <CSSTransition
                    timeout={0}
                    classNames="hero">
                        <h5 className="text-center mt-5">Героев пока нет</h5>
                    </CSSTransition>
        }
        return arr.map(({id, ...props}) => {
            return (
                <CSSTransition key={id} timeout={500} classNames="hero">
                    <HeroesListItem key={id} id = {id} onDelete={() => onDelete(id)} {...props}/>
                </CSSTransition>
            )
        })
    }

    const elements = renderHeroesList(filterHeroes);

    return (
        <TransitionGroup component="ul">
            {elements}
        </TransitionGroup>
    )
}

export default HeroesList;