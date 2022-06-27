import React from 'react'
import Image from 'next/image';
import { withStyles } from '@mui/styles'

const styles = theme => ({
    root: {
        background: theme.palette.primary[600],
        borderRadius: '3px',
        border: 'solid',
        borderWidth: '0.1px',
        borderColor: '#4e4e4e',
        padding: '15px',
        height: '100%',
        overflow: 'auto',
    },
    title: {
        color: theme.palette.primary.main,
        // textTransform: 'uppercase',
        margin: 0,
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '5px',
    },
    subtitle: {
        color: theme.palette.secondary.main,
        margin: 0,
        marginTop: '10px',
        marginBottom: '10px',
        marginLeft: '5px',
    },
})

const Section = ({
    children,
    classes,
    title,
    subtitle,
    image,

    renderButton
}) => {
    return (
        <div className={classes.root}>
            <div>
                <div style={{ textAlign: 'center' }}>
                    <h2 className={classes.title}>
                        {title }
                        {image ? (
                            <Image
                                src={image}
                                alt="Character Portrait"
                                width={30}
                                height={30}>       
                            </Image>
                        ) : (image)}
                    
                    {renderButton && (
                        <div style={{ alignSelf: 'center' }}>
                            {renderButton()}
                        </div>
                    )}
                    </h2>

                    
                    <span style={{ textAlign: 'center'}}
                    className={classes.subtitle}>
                        {subtitle}
                    </span>
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                {children}
            </div>
        </div>
    )
}

export default withStyles(styles)(Section);