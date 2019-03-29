import { FunctionComponent } from 'react'

declare global {

  interface StorefrontComponent<P = {}> extends FunctionComponent<P> {
    getSchema(props: P): object;
	}
	
	enum Position{
		left = 'left', 
		right = 'right', 
		up = 'up',
		down = 'down',
	}
	
	interface DrawerSchema {
		actionIconId: string,
		dismissIconId: string,
		position : Position,
		width: '100%' | 'auto',
		height: '100%' | 'auto' | 'fullscreen',
	}

	interface OverlaySchema {
		opacity?: number,
		color?: 'base' | 'base--inverted',
	}
}
